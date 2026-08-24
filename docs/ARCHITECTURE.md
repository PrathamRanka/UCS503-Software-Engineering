# Architecture

## Current application

```text
Browser
  └── Vite + React frontend
        ├── Reusable components
        ├── Local interaction state
        └── Mock data
```

The current demo has no server dependency.

## Planned MVP

```text
Browser
  └── React frontend
        └── HTTP/JSON
              └── Node.js + Express API
                    └── PostgreSQL database
```

Use one Node.js application. Organize it by feature, but do not split it into services.

Suggested API structure when backend work starts:

```text
api/src/
  server.ts
  config/
  middleware/
  features/
    auth/
    users/
    posts/
    comments/
    follows/
    communities/
```

`web` and `api` must each own their package file and lockfile. They are separate applications and are installed and run from their respective directories.

Each feature may contain its route, validation, service, and database functions. Add layers only when they solve a real problem.

## Architecture rules

- Use normal REST endpoints and JSON.
- Keep business logic in the Node API, not React components.
- Store uploaded image URLs rather than processing many media formats initially.
- Start with one PostgreSQL database.
- Use database queries for feed sorting until real performance measurements show a problem.
- Keep the MVP as one frontend, one API, and one database.
