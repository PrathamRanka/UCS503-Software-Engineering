# Development

## Setup

Run the frontend from its own application directory:

```bash
cd web
npm install
npm run dev
```

The terminal prints the local Vite URL, normally `http://localhost:5173`.

## Commands

Run these commands inside `web`:

```bash
npm run dev       # Start the frontend development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
npm run test:unit        # Utility and reusable component tests
npm run test:integration # Authentication and onboarding flow tests
npm run test:matrix      # Ensure every production source file has test coverage
npm run test:smoke       # Headless browser smoke and responsive checks
npm run test:staging     # Production assets and SPA deep-route checks
npm run test:all         # Run every test layer and the production build
```

## Working on the frontend

- Put reusable visual elements in `components/ui`.
- Put feed-specific components in `components/feed`.
- Put page shell components in `components/layout`.
- Put temporary demo content in `data/mockData.ts`.
- Keep TypeScript data types in `types`.
- Style components with Tailwind utilities instead of adding global CSS selectors.
- Run `npm run build` before sharing changes.

## Adding the backend later

Create `api` as a separate Node.js and Express project with its own `package.json`, lockfile, scripts, and environment variables. Do not share frontend dependencies with it. Start with health, authentication, users, and posts; connect the frontend only after each route works.
