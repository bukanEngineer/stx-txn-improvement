# AGENTS.md

## Cursor Cloud specific instructions

This is a single-package **Vite + React 19 + TypeScript** frontend app (`transaction-history`). There is no backend, database, or automated test suite — data comes from static mocks in `src/data/mockTransactions.ts`.

### Services
- **Vite dev server** (only required service): `npm run dev` serves the app at `http://localhost:5173`. Use this for development and manual testing.
- Optional production preview: `npm run build` then `npm run preview` (`http://localhost:4173`).

### Build / lint / test
- No `lint` or `test` scripts exist. The closest quality gate is `npm run build`, which runs `tsc -b` (type-check) before `vite build`. Use it to catch type errors.
- Testing is manual via the browser.

### Gotchas
- The design system dependency `prohellox-designsystem` declares `engines.node >=24.18.0`, so `npm install` prints an `EBADENGINE` warning under the environment's Node 22. This is only a warning — install, build, and runtime all work fine on Node 22.
