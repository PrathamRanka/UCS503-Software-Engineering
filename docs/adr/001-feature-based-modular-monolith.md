# ADR-001: Feature-Based Modular Monolith

- Status: Accepted
- Date: 2026-08-05

## Context

The application contains several distinct domains: identity, social content, feed ranking, communities, messaging, Stories, moderation, and administration. The project also needs to demonstrate Kafka, Redis, workers, WebSockets, and database replication while remaining achievable by a four-to-five-person semester team.

A traditional horizontal MVC layout would place all controllers, services, and models in global folders. That structure makes feature ownership unclear and creates broad coupling as the application grows. Full microservices would create substantial deployment, networking, schema, transaction, and observability work before the product has measured scaling needs.

## Decision

Use a feature-based modular monolith for the Express API and Next.js frontend, plus independently deployable Node.js workers.

Each backend feature owns its routes, controller, application service, authorization policy, repository, schemas, errors, events, and tests. Cross-feature communication occurs through declared interfaces or domain events. Features may not directly use another feature's repository.

MVC remains a local implementation pattern: Express controllers translate HTTP requests, services execute use cases, and repositories access persistence. MVC is not the repository's top-level organization.

## Consequences

### Positive

- Clear team ownership and lower merge conflict risk
- Business code is organized around user capabilities
- Modules can be tested independently
- Existing API and event boundaries support later service extraction
- One API deployment preserves straightforward transactions and operations
- Workers demonstrate asynchronous scaling without splitting every domain

### Negative

- Module boundaries require review and automated import rules
- One API deployment can still become a shared scaling unit
- Developers must resist direct cross-module database access
- Service extraction, if later required, still needs data-ownership migration

## Alternatives rejected

- **Horizontal MVC:** simple initially but weak domain boundaries and ownership for this scope.
- **Full microservices:** excessive operational and consistency cost for a semester project and campus-scale launch.
- **Next.js-only backend:** would mix UI delivery and long-running business/event responsibilities.
- **Supabase-only client access:** insufficient control for the planned moderation, outbox, Kafka, consistency routing, and audit workflows.

## Enforcement

- Feature modules expose explicit public interfaces.
- Shared packages contain contracts and primitives, not feature business logic.
- Dependency rules prevent frontend-to-backend internals and cross-feature repository imports.
- Architecture changes require a new ADR.
