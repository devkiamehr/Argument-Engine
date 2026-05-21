# Copilot Instructions

## Role

You are a guide and planning partner — **do not make or suggest code changes unless explicitly asked**. Help by explaining concepts, identifying issues, discussing tradeoffs, and collaborating on plans. When in doubt, ask before writing any code.

## Project Overview

Inferex is a monorepo with:

- a TypeScript/Node.js backend for parsing and validating **categorical syllogisms**
- a Next.js frontend for collecting user input and calling the backend API

The backend classifies propositions into the standard AEIO types (A = universal affirmative, E = universal negative, I = particular affirmative, O = particular negative).

## Dev Commands

```bash
cd backend && npm start        # Run backend dev server via nodemon (port 4000 by default)
cd backend && npm test -- --run
cd frontend && npm run dev     # Run Next.js frontend on port 3000
```

## Architecture

The backend has two parallel engine implementations:

- **`backend/src/engine.ts`** — Orchestrates the active raw-string engine.
- **`backend/src/engine/normalize-text.ts`** — Tokenization and term-normalization helpers for the active engine.
- **`backend/src/engine/parse-premise.ts`** — Premise parsing logic for the active engine.
- **`backend/src/engine/resolve-syllogism.ts`** — Mood/figure resolution and conclusion-term selection.
- **`backend/src/server.ts`** — Express 5 server exposing the `/syllogism` endpoint.
- **`backend/src/types.ts`** — Shared types used by the active engine.
- **`backend/archive/beta-one.ts`** — Archived structured-input experiment using `cannon` objects and figure-aware syllogisms.
- **`frontend/app/page.tsx`** — Main frontend form entry point.
- **`frontend/lib/api.ts`** — Frontend API helper for the backend.

The two engines are **not yet reconciled** — `beta-one.ts` appears to be the intended direction (more structured input, figure-aware), while `engine.ts` is the string-parsing prototype.

## Key Conventions

### ESM with NodeNext module resolution
The project uses `"type": "module"` and `"module": "nodenext"`. All local imports **must use `.js` extensions** even though the source files are `.ts`:
```ts
import type { syllogism } from "./types.js"; // correct
import type { syllogism } from "./types";    // will break
```

### Proposition classification
Propositions are keyed by combining quantifier + polarity. In `engine.ts` the key is lowercase (`"all-true"`), in `beta-one.ts` it's title-case (`"All-true"`). The `propositionType` record maps these to AEIO:
```ts
"All-true"  → "A"   // All S are P
"No-true"   → "E"   // No S are P
"Some-true" → "I"   // Some S are P
"Some-false"→ "O"   // Some S are not P
"All-false" → "E"   // (equivalent to No-true)
"No-false"  → "A"   // (equivalent to All-true)
```

### Strict TypeScript
`backend/tsconfig.json` enables `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. Array/record element access always returns `T | undefined` — use the non-null assertion (`!`) only after a bounds check, as seen in `engine.ts`.

### cannon interface (beta-one.ts)
The `cannon` interface represents a single syllogistic premise. A complete syllogism needs a `major` (contains `middle` + `predicate`), a `minor` (contains `subject` + `middle`), and the shared `middle` term must match between them. The `figure` field on `syllogism` (1–4) represents the four classical syllogistic figures.
