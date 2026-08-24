# Technology

## Approved stack

| Area | Technology | Reason |
| --- | --- | --- |
| Frontend | React + Vite | Fast setup and simple deployment |
| Language | TypeScript | Safer component and API contracts |
| Styling | Tailwind CSS v4 | Component-local utility styling without a growing global stylesheet |
| Icons | Lucide React | Small, consistent icon set |
| Routing | React Router | Direct URLs and browser navigation for every screen |
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
- Use the native system sans-serif stack found in Instagram-like interfaces; do not bundle proprietary font files.
- Keep light mode as the default and persist the user's light/dark choice in local storage.
- Keep raster frontend assets in WebP format.
