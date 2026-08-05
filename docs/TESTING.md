# Testing and Quality Strategy

## Test layers

### Static quality

- TypeScript strict mode
- ESLint and Prettier checks
- Dependency and secret scanning
- API/event schema compatibility checks
- Database migration linting

### Unit tests

Use Vitest for ranking functions, visibility policies, role policies, validators, state machines, moderation thresholds, cursor encoding, and event handlers.

### API integration tests

Use Supertest against Express with a disposable database. Tests must exercise real authentication claims, transactions, RLS, Valkey behavior, and outbox records rather than mocking repositories on critical paths.

### Worker and event tests

- Consumer idempotency
- Duplicate and out-of-order events
- Retry and dead-letter behavior
- Kafka unavailable while database writes continue
- Worker crash between external effect and acknowledgement
- Schema compatibility between producer and consumer

### Frontend tests

- Component interaction and accessibility tests
- Loading, empty, error, and moderation-pending states
- Mobile viewport and keyboard navigation
- Reduced-motion behavior
- Realtime disconnect and reconnect behavior

### End-to-end tests

Use Playwright for:

1. Approved-domain onboarding
2. Rejected external-domain onboarding
3. Creating and publishing clean content
4. Flagged content entering moderation
5. Admin decision and member appeal
6. Following, blocking, and visibility behavior
7. Community request and approval
8. Direct and group messaging
9. Story publication, viewing, reply, highlight, and expiry
10. Role and audit-log restrictions

### Performance and resilience

Use k6 and scripted failure tests to measure:

- Feed and profile API latency
- Concurrent WebSocket connections
- Upload-session creation
- Kafka producer and consumer lag
- Worker throughput
- Valkey cache hit ratio
- Replica lag and primary fallback
- Recovery after Kafka, Valkey, worker, replica, and Realtime interruption

## Security test matrix

Every user-owned endpoint requires tests for owner, eligible member, unrelated member, blocked user, admin, and unauthenticated caller as applicable. Tests must attempt horizontal and vertical privilege escalation.

## Quality gates

A change may merge only when:

- Type checking, linting, unit tests, and relevant integration tests pass.
- New behavior includes tests and updated contracts.
- Database migrations include forward and rollback/mitigation notes.
- No critical or high-severity known security issue is introduced.
- Accessibility checks pass for affected primary flows.
- Documentation changes accompany architecture or public-contract changes.

## Release acceptance

- No open severity-one defect.
- Identity, authorization, moderation, and message privacy suites pass completely.
- Kafka and Valkey failure demonstrations preserve authoritative data.
- The full Docker environment can be started from documented commands.
- Seeded demo data can be reproduced.
- A clean environment can complete the critical E2E suite.
