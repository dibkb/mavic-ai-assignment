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
| **Image**      | Stores Midjourney/DALL-E renders together with provenance (`userId`, `brandId`) and the latest `endScore` for quick sorting.              |
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
