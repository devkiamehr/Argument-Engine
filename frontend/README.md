# Inferex Frontend

Inferex Frontend is the Next.js interface for submitting syllogism premises to the Inferex backend API.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The frontend expects the backend API at `http://localhost:4000` by default.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## API Integration

The frontend submits premise payloads through `lib/api.ts` to the backend `/syllogism` endpoint.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```
