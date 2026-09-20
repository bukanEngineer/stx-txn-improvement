# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Vite + React 19 + TypeScript** frontend (`transaction-history`) — a Transaction History dashboard prototype. There is no backend, database, or API; all data is in-memory mock data in `src/data/mockTransactions.ts`.

### Services

Only one service is needed for end-to-end work: the **Vite dev server**.

- Run dev server: `npm run dev` → serves at `http://localhost:5173/` (HMR enabled). Not exposed on the network by default; add `--host` if external access is needed.
- Production build + typecheck: `npm run build` (`tsc -b && vite build`, outputs to `dist/`).
- Preview built bundle: `npm run preview`.

Commands are defined in `package.json`. There are **no lint or test scripts configured** (no ESLint/Prettier, no test runner) — do not expect `npm run lint`/`npm test` to exist.

### Gotchas

- `prohellox-designsystem` declares `engines.node >=24.18.0`, but the app installs, builds, and runs fine on the environment's Node 22. `npm install` prints a non-fatal `EBADENGINE` warning that can be ignored.
