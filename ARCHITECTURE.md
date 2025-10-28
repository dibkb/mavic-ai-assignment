# ARCHITECTURE

## 1. Key Extensions

| Area           | Key files / modules       | Purpose                                                                                                           |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **AI Agents**  | `ai/agents/*.ts`          | Four scoring agents (creativity, size, mood, semantics) plus an aggregator that computes the final grade.         |
| **Workflows**  | `ai/workflows/*.ts`       | Chains the evaluation flow: extract metadata → run agents in parallel → aggregate scores → save to DB.            |
| **Tools**      | `ai/tools/*.ts`           | Helper functions for image analysis (color palette, captions, stats, EXIF). Keeps agent logic clean and testable. |
| **API Routes** | `app/api/**`              | REST endpoints for auth, image upload, triggering evaluations, and fetching dashboard data.                       |
| **Dashboards** | `components/dashboard/**` | Admin UI with tabs, metric cards, status indicators, and a media grid showing evaluation progress.                |
| **Workers**    | `workers/image-grader.ts` | Background queue worker that processes images, runs the AI workflow, and updates the database.                    |

## 2. Data Model (MongoDB + Prisma)

Using MongoDB via Prisma (`provider = "mongodb"`). Schema is optimized for fast reads with clear relations.

### Core Collections

| Collection     | What it stores                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **User**       | Basic auth fields (`userId`, `password`), role (`user` or `admin`), related images.                                            |
| **Brand**      | Brand profile for prompt conditioning. Includes style, voice, vision, and brand colors as a string array.                      |
| **Image**      | AI-generated image with metadata: path, prompt, model, channel, and references to user & brand.                                |
| **Evaluation** | Per-image evaluation results. Contains JSON blobs for each agent (`creativity`, `size`, `mood`, `semantics`) plus final score. |

### Why these choices

1. **MongoDB flexibility** – Agent outputs vary in structure, so JSON fields let us evolve metrics without schema migrations.
2. **ObjectId references** – Using IDs instead of nested documents keeps documents lightweight and queries fast.
3. **Status enum** – `EvalStatus` tracks pipeline state (`pending` → `processing` → `completed`/`failed`) for easy filtering.

## 3. Seeding

`prisma/seed.ts` loads the provided CSVs (`brands.csv`, `prompts.csv`, `users.csv`) into MongoDB:

1. Parse CSVs with `csv-parse`
2. Upsert records using Prisma (idempotent, safe to re-run)
3. Create sample images for testing

## 4. Evaluation Pipeline (3 Stages)

The UI reflects three states that map directly to `EvalStatus`:

1. **Pending** – Image uploaded, waiting for worker (grey indicator)
2. **Processing** – Worker running agents (yellow spinner)
3. **Completed / Failed** – Shows final score and metric breakdown (green/red with status chips)

This keeps both backend state and UI synchronized and easy to debug.

## 5. Worker & UI Updates

- **Background worker** (`workers/image-grader.ts`) pulls jobs from Redis queue, runs the evaluation workflow, and writes results to MongoDB.
- **Dashboard UI** polls `/api/evaluations` every 3 seconds to fetch updates. Simple approach that keeps hosting easy (no websocket infrastructure needed).
- When worker marks status as `completed`, the next poll updates the UI with color-coded scores and metric chips.

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

### Agent Details

| Agent      | What it checks                                              | Score (0-1) | How                                   |
| ---------- | ----------------------------------------------------------- | ----------- | ------------------------------------- |
| Creativity | Color variance, prompt token diversity, visual entropy      | 0-1         | Combines heuristics with LLM analysis |
| Size-Fit   | Image dimensions vs channel requirements (IG, TikTok, etc.) | 0-1         | Checks against aspect ratio table     |
| Mood       | Alignment between brand mood keywords and image mood        | 0-1         | LLM scoring + cosine similarity       |
| Semantics  | Prompt matches brand voice and keywords                     | 0-1         | Embeddings similarity using OpenAI    |

### Aggregation

**Final Score** = weighted average of agent scores (default weight = 1 for all)

**Confidence** = 100 - standard deviation (clamped 0-100). Lower variance = higher confidence.

## 7. Caching Strategy

LLM results are cached in Redis (`lib/llm-cache.ts`):

- **Cache key**: SHA-1 hash of `(stepId, prompt, imagePath)`
- **TTL**: 14 days
- **Lock mechanism**: Prevents duplicate concurrent LLM calls for the same input
- **Benefit**: Re-evaluating the same image+prompt combo costs zero tokens and returns instantly

## 8. Design Trade-offs

| Choice                         | Why                               | Downside                                      |
| ------------------------------ | --------------------------------- | --------------------------------------------- |
| LLM scoring vs pure heuristics | Captures nuanced creative quality | Higher cost & latency (cached where possible) |
| Polling instead of websockets  | Simpler hosting, serverless-ready | 3-second lag in UI updates                    |
| JSON blobs for agent outputs   | Easy to extend and evolve metrics | Needs custom helpers for dashboard queries    |
| Weighted average aggregation   | Simple, transparent, configurable | Doesn't capture complex metric interactions   |
