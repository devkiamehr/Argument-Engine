# Inferex

**Live at [inferex.app](https://inferex.app)**

Inferex is a backend-focused logic application that takes two natural-language categorical premises, parses them into structured propositions, normalizes the terms, determines mood and figure, and either returns the implied syllogistic conclusion or a precise error if the argument is invalid. It includes a Prisma/Postgres database and JWT-based authentication so users can create accounts, persist their syllogisms, and securely access their saved analyses across sessions.

A portfolio project by [Kia Aval](https://github.com/kiaaval).

## How it works

1. **Parse** — each premise, written in plain English, is classified as one of the four categorical proposition types (A, E, I, O) and split into subject and predicate terms.
2. **Normalize** — terms are normalized (singular/plural, copula variants) so the shared middle term can be matched across premises.
3. **Resolve** — the engine determines the argument's mood and figure, validates it against the recognized valid syllogistic forms, and derives the conclusion — or explains exactly why no conclusion follows.

## Tech stack

| Layer | Technology |
| --- | --- |
| Engine & API | Node.js, TypeScript, Express 5 |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT (httpOnly cookie) with bcrypt password hashing |
| NLP | `natural` for term normalization |
| Frontend | Next.js, React, Tailwind CSS, shadcn/ui, Zustand |
| Testing | Vitest |

## Repository structure

| Path | Purpose |
| --- | --- |
| `backend/` | Syllogism engine (`src/engine/`), REST API, Prisma schema, tests, and archived experiments |
| `frontend/` | Next.js app — marketing landing, analyzer, history, and account pages |
| `.github/` | Repository-level GitHub configuration and Copilot instructions |

## API overview

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/user/register` | — | Create an account |
| `POST` | `/user/login` | — | Sign in, sets JWT cookie |
| `POST` | `/user/logout` | ✓ | Sign out |
| `GET` | `/user/me` | ✓ | Current user |
| `PUT` | `/user` | ✓ | Update account |
| `DELETE` | `/user` | ✓ | Delete account |
| `POST` | `/syllogism` | ✓ | Analyze two premises and save the result |
| `GET` | `/syllogism` | ✓ | List saved syllogisms |
| `GET` | `/syllogism/:id` | ✓ | Fetch one analysis |
| `DELETE` | `/syllogism/:id` | ✓ | Delete an analysis |

## Run the backend

```bash
cd backend
npm install
npm start
```

The backend listens on `http://localhost:4000` by default and expects these environment variables (e.g. in `backend/.env`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `FRONTEND_ORIGIN` | Allowed CORS origin (defaults to the local frontend) |

Run the engine and API tests with `npm test`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default and targets the backend API on `http://localhost:4000`.
