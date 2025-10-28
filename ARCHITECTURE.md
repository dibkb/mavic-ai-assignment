# ARCHITECTURE

## 1. Extending the Base Repository

| Area           | Key files / modules       | Purpose                                                                                                                 |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **AI Agents**  | `ai/agents/*.ts`          | Independent scoring agents for creativity, size-fit, mood & semantics, plus an _aggregator_ to compute the final grade. |
| **Workflows**  | `ai/workflows/*.ts`       | Orchestrate a chain-of-thought flow: extract metadata → run agents in parallel → aggregate → persist results.           |
| **Tools**      | `ai/tools/*.ts`           | Thin wrappers around image-analysis utilities (palette, captions, statistics, EXIF). Keeps the agents pure & testable.  |
| **API Routes** | `app/api/**`              | REST endpoints for login, image upload, evaluation trigger & admin dashboards. Built on Next.js Route Handlers.         |
| **Dashboards** | `components/dashboard/**` | Admin UI – tabs, metrics, status chips & media grid for a crisp overview of grading progress.                           |
| **Workers**    | `workers/image-grader.ts` | Background queue worker; dequeues images, invokes the AI workflow and updates the DB without blocking the API.          |

## 2. Data Model (MongoDB via Prisma)

Prisma is configured with the MongoDB connector (`datasource db { provider = "mongodb" }`). The schema is optimised for document reads while keeping relations explicit enough for clarity.

### Core Collections

| Collection     | Highlights                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **User**       | Minimal auth fields (`userId`, `password`\*), role enum (`user`, `admin`) and 1-to-many `images`.                                         |
| **Brand**      | Marketing profile used for prompt conditioning; array of brand colours stored as `String[]`.                                              |
| **Image**      | Stores ai render together with provenance (`userId`, `brandId, used_prompt `)                                                             |
| **Evaluation** | One document per image-run. Holds agent JSON blobs (`creativity`, `size`, `mood`, `semantics`) plus aggregated `endScore` & `confidence`. |

\*Passwords are optional in this prototype – we rely on magic-link auth in production.

### Design Choices

1. **Document DB** – Evaluations are semi-structured; MongoDB’s flexible schema lets us pack agent outputs as JSON without painful migrations.
2. **Embedded IDs** – We store `userId`, `brandId`, `imageId` as `ObjectId` refs instead of nesting to avoid document bloat.
3. **Enum Status** – `EvalStatus` (`pending`, `processing`, `completed`, `failed`) keeps the pipeline observable at a glance.

## 3. Seeding Strategy

`prisma/seed.ts` streams the provided CSV files (`brands.csv`, `prompts.csv`, `users.csv`) into MongoDB:

1. Parse with `csv-parse`.
2. Upsert via `PrismaClient` to remain idempotent.
3. Attach sample images so the dashboard isn’t empty on first run.

## 4. Three-Stage Evaluation Flow (UI-First)

1. **Pending** – Image registered but not yet picked up by the worker (neutral grey dot).
2. **Processing** – Worker is running agents; real-time WebSocket pushes incremental scores (yellow spinner).
3. **Completed / Failed** – Aggregated `endScore` & per-metric chips displayed; failures surfaced with toast + retry (green / red).

This simple, linear state machine maps 1-to-1 to the `EvalStatus` enum, keeping both the backend and the React UI intuitive and debuggable.

## 5. Real-Time Updates & Worker Pattern

- The **background worker** (`workers/image-grader.ts`) dequeues jobs from Redis, runs the LLM workflow (see § 6) and persists the `Evaluation` document.
- The **dashboard UI** polls the `/api/evaluations/pending` & `/api/evaluations` endpoints every 3 s. This keeps infra simple while still feeling real-time; websocket support can be toggled in the future.
- After the worker writes `EvalStatus.completed`, the next poll refreshes the row, colour-coding the chips and bumping charts.

## 6. LLM Evaluation Workflow

```
┌───────────────┐   ┌──────────────┐
│ Image + Prompt┼─▶ │ Metadata Step│ (caption, palette, stats, exif)
└───────────────┘   └─────┬────────┘
                          ▼ (fan-out)
  ┌──────────┐  ┌────────┐  ┌───────┐  ┌──────────┐
  │Creativity│  │  Size  │  │  Mood │  │ Semantics│  (agents, run in parallel)
  └────┬─────┘  └──┬─────┘  └──┬────┘  └────┬─────┘
       └───────────┴────────────┴────────────┘
                    ▼
           ┌─────────────────┐
           │  Aggregator     │ → endScore + confidence
           └─────────────────┘
```

Agent summaries:

| Agent      | Task & Inputs                                                               | Output<br>`0-1` | Notes                                          |
| ---------- | --------------------------------------------------------------------------- | --------------- | ---------------------------------------------- |
| Creativity | Measures colour variance, prompt token entropy, image entropy.              | score           | Heuristic + LLM reasoning if variance unclear. |
| Size-Fit   | Compares rendered resolution to channel requirements (e.g. IG Reel).        | score           | Uses hard-coded aspect-ratio table.            |
| Mood       | LLM rates alignment between desired mood keywords and CLIP mood vectors.    | score           | Cosine similarity averaged.                    |
| Semantics  | Checks keyword overlap & embedding similarity between prompt & brand voice. | score           | OpenAI embeddings with 100-D PCA cache.        |

**Scoring formula** (`ai/agents/aggregator.ts`):

_Weighted mean_: ∑ scoreᵢ·weightᵢ / ∑weightᵢ (default weight = 1).

_Confidence_: 100 − σ (std-dev) clamped to \\[0,100\\]. High variance ⇒ lower confidence.

## 7. Caching

- `lib/llm-cache.ts` hashes `(stepId, prompt, imagePath, …)` to a SHA-1 key stored in Redis for 14 days.
- **Optimistic locking** avoids 🏃‍♂️ thundering-herd with a short `lock:<key>`.
- _Benefit_: repeated grading of identical creatives incurs zero extra token cost and returns instantly from cache.

## 8. Trade-offs

| Decision                                      | Pros                                      | Cons                                                                               |
| --------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| LLM-driven creativity/mood vs hard heuristics | Captures nuance beyond simple histograms. | Cost & latency; mitigated via caching.                                             |
| Polling UI instead of websockets              | Easiest to host (serverless-friendly).    | 2–3 s lag & extra queries.                                                         |
| Separate agent JSON blobs                     | Flexible & independently evolvable.       | Querying inside dashboards needs projection helpers.                               |
| Weighted mean aggregator                      | Transparent, tweakable per-brand.         | Ignores nonlinear interactions between metrics – could upgrade to small MLP later. |
