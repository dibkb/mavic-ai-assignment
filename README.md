# Mavic AI Assignment

A full-stack Next.js app for generating, grading and managing AI-generated images for marketing brands.

---

## 0. Prerequisites

- **Node.js v20+** and **npm** or **pnpm**
- **MongoDB** connection string (local Docker, Atlas, etc.)

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure environment variables

Create a copy of `.env.example` (or create a new `.env`) and fill in at least the following keys:

```bash
# .env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/mavic?retryWrites=true&w=majority"
JWT_SECRET="change-me-in-production"
REDIS_URL="redis://localhost:6379"           # required by Bee-Queue worker
OPENAI_API_KEY="sk-..."                      # required by the llm agents
REDIS_URL_CACHE=                             # used for caching llm response
```

---

## 3. Prepare the Prisma client & database

Choose the path that matches **your database state**. In all cases you will end with a generated Prisma client.

### A) 🆕 Fresh database (no existing collections)

```bash
# Generate the Prisma client TS types
npx prisma generate

# Push the schema to the database (creates collections & indices)
npx prisma db push

# Seed initial data (admin user, brands, prompts, …)
npx prisma db seed
```

### B) ♻️ Existing database (already has collections / data)

```bash
# Pull the live schema from the database into prisma/schema.prisma
npx prisma pull

# Regenerate the Prisma client based on the pulled schema
npx prisma generate
```

---

## 4. Run the app

### 4.1 Next.js development server

```bash
npm run dev
```

The app is now available at <http://localhost:3000>.

### 4.2 Image-grading worker (Bee-Queue)

Open **a second terminal** and start the worker:

```bash
npm run start:worker
```

The worker listens for grading jobs placed on the Redis queue by the web application.

---

## 5. Login to the Admin UI

Navigate to <http://localhost:3000/admin> and log in using the seeded credentials:

- **Username:** `admin`
- **Password:** `test`

Upon successful login you will be redirected to the dashboard.

---

## 6. Dashboard features

- `/admin/dashboard?tab=brands` – list of brands (sortable)
- `/admin/dashboard?tab=generated-images` – all generated images with preview (sortable & filterable)
- `/admin/dashboard?tab=evaluated-images` – graded images after evaluation (sortable)

---

## 7. Useful npm scripts

```bash
npm run prisma:generate   # shorthand for: prisma generate
npm run prisma:seed       # runs prisma/seed.ts via ts-node
npm run start:worker      # launches the Bee-Queue image-grader worker
```

---

## 8. Troubleshooting

1. **Prisma client not found.** Always re-run `npx prisma generate` after modifying `schema.prisma` or running `prisma pull`.
2. **Connection errors.** Verify `DATABASE_URL` and that MongoDB / Redis servers are reachable.
3. **Seed failures.** Make sure the database is empty (or collections removed) before seeding a fresh database.

---
