# Development Environment

## Prerequisites

- Git
- Node.js 24 LTS
- pnpm 10
- Docker Desktop or compatible Docker Engine with Compose
- At least 12 GB free memory for the complete local profile; lightweight development needs substantially less

All commands described here are targets for the implementation phase; application scaffolding has not yet been created.

## Environment profiles

### Lightweight

- Local Next.js, Express, and worker processes
- Free hosted Supabase or reduced local Supabase
- Mock moderation
- Optional local Kafka and Valkey

### Full demo

- Self-hosted Supabase
- PostgreSQL primary and read replica
- Kafka KRaft broker
- Valkey
- ClamAV
- Local moderation service
- Prometheus and Grafana
- Next.js, Express, outbox publisher, and worker

## Planned commands

```text
pnpm install
pnpm dev
pnpm infra:up
pnpm infra:down
pnpm db:migrate
pnpm db:seed
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm test:load
pnpm contracts:validate
```

## Seed identities

The deterministic seed set includes member, second member, blocked pair, community moderator, admin, super admin, suspended user, clean content, flagged content, conversation, Story, moderation case, and notification fixtures. Seed addresses use non-routable example values and never real student data.

## Local security

- Copy `.env.example` to a local ignored file.
- Never commit Supabase service keys, OAuth secrets, database passwords, or signing keys.
- Demo secrets are generated per machine and are not reused for deployment.
- Full-demo ports bind to localhost unless explicitly required.
- The moderation service, database, Kafka, and Valkey are not publicly exposed.
