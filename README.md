# Inferex

Inferex is organized as a two-part application:

- `backend/` — the Node.js and TypeScript inference engine plus REST API
- `frontend/` — the Next.js interface for submitting premises and showing results

## Structure

| Path | Purpose |
| --- | --- |
| `backend/` | Syllogism engine, API, tests, and archived backend experiments |
| `frontend/` | Next.js frontend application |
| `.github/` | Repository-level GitHub configuration and Copilot instructions |

## Run the backend

```bash
cd backend
npm install
npm start
```

The backend listens on `http://localhost:4000` by default.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default and targets the backend API on `http://localhost:4000`.
