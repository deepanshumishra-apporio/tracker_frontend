# Parcel Tracker — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS dashboard for the multi-carrier
tracker. Runs on **Bun**. Talks to the FastAPI backend over REST.

## Stack
- **Next.js 15** (App Router, React 19)
- **Tailwind CSS 4**
- **Vitest + Testing Library** for unit/component tests
- Zero runtime data-fetching libraries — a small typed `api` client + a
  `useShipments` hook keep the dependency surface minimal.

## What it does
A single **live-search** page: pick a carrier, enter a tracking number, hit
**Track** → the backend scrapes on demand and returns the result. **Nothing is
stored** — the result lives in component state only, so refreshing the page
clears it.

## Structure
```
src/
  app/
    layout.tsx                      app shell (header/footer)
    page.tsx                        the search page (form + live result)
  components/
    ui/          reusable primitives: Button, Card, Badge, Input, Select, Spinner, EmptyState
    TrackForm, ShipmentResult, StatusBadge, CarrierBadge, Timeline
  lib/
    api.ts        typed fetch client (ApiError) — calls GET /api/track
    types.ts      shared contract types (mirror backend schemas)
    format.ts     labels, colors, date/relative-time helpers
    cn.ts         classnames joiner
```
Presentational components take plain props (no data fetching) so they are pure
and easy to test; the page owns the single live-search call.

## Setup
```bash
bun install
cp .env.example .env.local     # then set NEXT_PUBLIC_API_URL if not localhost:8000
```

## Run
Start the backend API first (see ../backend), then:
```bash
bun run dev        # http://localhost:3000
```

## Scripts
```bash
bun run dev         # dev server
bun run build       # production build
bun run start       # serve production build
bun run test        # run the Vitest suite once
bun run test:watch  # watch mode
bun run typecheck   # tsc --noEmit
```

## Configuration
| Env var               | Default                 | Purpose                        |
| --------------------- | ----------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | Base URL of the backend API.   |

> `NEXT_PUBLIC_*` values are inlined at build time — set it before `bun run build`.
