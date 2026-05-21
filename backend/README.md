# Inferex Backend

Inferex Backend is the Node.js and TypeScript service for parsing and validating categorical syllogisms. It accepts two premises written in plain language, classifies them into AEIO proposition types, determines whether the syllogism is valid, and produces the resulting conclusion.

## What it does

- Parses ordinary-language premises such as `all men are mortal`
- Normalizes terms enough to detect shared middle terms
- Identifies mood and figure for supported categorical syllogisms
- Returns a generated conclusion for valid inputs
- Exposes the engine through a small Express API

## Project structure

| Path | Purpose |
| --- | --- |
| `src/engine.ts` | Active syllogism parser and Inferex inference engine |
| `src/types.ts` | Shared types for the active engine |
| `src/server.ts` | Express server exposing the `/syllogism` endpoint |
| `src/engine/normalize-text.ts` | Tokenization and normalization helpers |
| `src/engine/parse-premise.ts` | Premise parsing helpers |
| `src/engine/resolve-syllogism.ts` | Mood, figure, and conclusion-resolution helpers |
| `test/engine.test.ts` | Vitest coverage for the active engine |
| `archive/beta-one.ts` | Archived experimental structured-input engine |

## Requirements

- Node.js
- npm

## Install

```bash
npm install
```

## Run the API

```bash
npm start
```

The server listens on `http://localhost:4000` by default.

## API

### `POST /syllogism`

Send JSON with two premises:

```json
{
  "lineOne": "all men are mortal",
  "lineTwo": "socrates is man"
}
```

Successful responses return:

```json
{
  "conclusion": "socrates is mortal"
}
```

Invalid requests return a JSON error response:

```json
{
  "error": "Invalid syllogism: no middle term detected."
}
```

## Architecture

Pipeline:

`raw input -> tokenization -> normalization -> parsing -> mood/figure analysis -> conclusion generation`

## Run tests

```bash
npm test -- --run
```

## Notes

- The active engine currently works from raw string premises.
- `archive/beta-one.ts` is preserved as a reference for a more structured design direction, but it is not part of the runtime path.
- Local TypeScript imports use `.js` extensions because the project runs in ESM/NodeNext mode.
