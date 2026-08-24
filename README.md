# Thapar Talks

A complete client-side Instagram-style campus social prototype for TIET students. It is built for presentation now and structured so a Node.js backend can replace the mock data next.

## Current stack

- Frontend: React, Vite, TypeScript, Tailwind CSS v4
- Icons: Lucide React
- Backend: Node.js and Express planned for the next phase
- Data: Mock data today; PostgreSQL can be added when the API is built

## Frontend feature coverage

- Mock Google sign-in restricted to `@thapar.edu`
- Account registration and profile onboarding
- Home feed, stories, likes, comments, saves, follows and sharing
- Search, Explore grid and Reels interface
- Direct messages and conversation UI
- Notifications and follow requests
- Post creation with local image upload
- Profile posts, saved posts, tagged posts and highlights
- Profile settings, privacy controls and logout
- Routed post details and full comment threads
- Story creation, editing, deletion and highlights
- Reel upload, editing, deletion and real video playback
- Other-user profiles and follower/following lists
- New direct/group chats and image messages
- Edit, archive, restore, delete, report, block and mute flows
- Password recovery and account deletion
- Loading, empty, error and not-found states
- TIET-centered society and event content based on public institute pages
- Persistent light and dark modes, with light mode as the default
- WebP-only bundled raster assets

## Client routes

`/`, `/search`, `/explore`, `/reels`, `/messages`, `/notifications`, `/profile`, `/profile/:username`, `/post/:postId`, `/archive`, `/settings`, `/reset-password`

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
See [docs/CONTENT.md](docs/CONTENT.md) for content sourcing and mock-data boundaries.
