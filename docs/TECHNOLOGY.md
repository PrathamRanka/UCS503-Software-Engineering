# Technology

## Approved stack

| Area | Technology | Reason |
| --- | --- | --- |
| Frontend | React + Vite | Fast setup and simple deployment |
| Language | TypeScript | Safer component and API contracts |
| Styling | Tailwind CSS | Component-local utility styling without a growing global stylesheet |
| Icons | Lucide React | Small, consistent icon set |
| Backend | Node.js + Express | Simple JavaScript/TypeScript API |
| Database | PostgreSQL | Add when persistent data is required |
| Testing | Vitest + React Testing Library | Add with connected features |

## Current requirements

- Node.js 20 or newer
- npm 10 or newer

## Technology policy

- Prefer an existing dependency only when it removes meaningful work.
- Avoid adding infrastructure before the application needs it.
- Keep frontend and backend independently runnable.
- Keep separate `package.json` and lockfiles inside `web` and `api`.
- Record environment variables in `.env.example` when the backend is introduced.
