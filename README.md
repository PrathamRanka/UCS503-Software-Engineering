# Thapar Talks

A simple Instagram-style campus social application for TIET students. The current version is a polished frontend demo built for fast iteration and presentation.

## Current stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Icons: Lucide React
- Backend: Node.js and Express planned for the next phase
- Data: Mock data today; PostgreSQL can be added when the API is built

The project intentionally uses a small stack that the team can understand, run, and extend quickly.

## Run locally

```bash
cd web
npm install
npm run dev
```

Build the production bundle:

```bash
cd web
npm run build
```

## Repository structure

```text
web/                   Vite React frontend with its own package.json
  src/
    components/        Reusable UI grouped by purpose
    data/              Temporary mock content
    types/             Shared TypeScript models
    App.tsx             Page state and component composition
api/                   Future Node backend with a separate package.json
docs/                  Short project documentation
project-proposal/      Original submission material
```

Start with [docs/README.md](docs/README.md) for the active documentation.
