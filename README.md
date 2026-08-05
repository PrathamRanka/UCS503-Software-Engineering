# TIET Campus Social Platform

A private, mobile-first social platform for verified `@thapar.edu` users, combining short-form reels, social posts, communities, stories, and messaging.

This repository is currently in the architecture and documentation phase. Application code will be added only after the requirements and designs are reviewed.

## Chosen stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Workers: Node.js worker processes
- Platform services: Supabase Auth, PostgreSQL, Storage, and Realtime
- Eventing and cache: Kafka and Redis
- Local infrastructure: Docker Compose
- Testing: Vitest, Supertest, Playwright, and k6

## Architecture decision

The system uses a **feature-based modular monolith with asynchronous workers**. It is not organized as a traditional horizontal MVC project. Each feature owns its HTTP controllers, application services, domain rules, repositories, events, validation, and tests. Express still uses controller/service concepts internally, but feature boundaries are the primary structure.

See [docs/README.md](docs/README.md) for the complete documentation index.

## Proposed repository structure

```text
apps/
  web/       Next.js frontend
  api/       Express application API
  worker/    Kafka consumers and scheduled jobs
packages/
  contracts/ Shared API schemas and event contracts
  config/    Shared TypeScript and lint configuration
  testing/   Shared fixtures and test utilities
infra/
  docker/    Local distributed architecture
docs/        Product and engineering documentation
```

## Current status

- [x] Product scope established
- [x] High-level architecture established
- [x] Low-level architecture established
- [x] Security, testing, and operations strategy documented
- [ ] Repository scaffold
- [ ] Application implementation
- [ ] Pilot deployment
