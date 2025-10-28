# Mavic AI – Quick Start

> A tiny guide to get the project running locally.

---

## 1. Install & configure

```bash
npm install
cp .env.example .env   # then fill in the blanks
```

Minimum .env keys:

```bash
DATABASE_URL=           # MongoDB connection
JWT_SECRET=             # any secret string
OPENAI_API_KEY=         # OpenAI key for LLMs
REDIS_URL=redis://localhost:6379
```

---

## 2. Set up Prisma

Pick **one** path:

| Your DB              | Commands                                                          |
| -------------------- | ----------------------------------------------------------------- |
| **New / empty**      | `npx prisma generate && npx prisma db push && npx prisma db seed` |
| **Already has data** | `npx prisma pull && npx prisma generate`                          |

---

## 3. Start things

Terminal 1

```bash
npm run dev
```

Terminal 2 (worker)

```bash
npm run start:worker
```

Open http://localhost:3000/admin

Login: `admin` / `test` (from seed data)

---

## 4. Admin dashboard tabs

- Brands – `/admin/dashboard?tab=brands`
- Generated images – `/admin/dashboard?tab=generated-images`
- Evaluated images – `/admin/dashboard?tab=evaluated-images`

---

Happy hacking 👋
