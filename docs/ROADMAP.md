# Delivery Roadmap

## Team model

For a four-to-five-person team:

- Frontend and design system owner
- API and identity/data owner
- Events, workers, media, and moderation owner
- Messaging, Stories, and Realtime owner
- Quality, infrastructure, and documentation responsibilities shared across the team

Every subsystem requires a primary owner and reviewer. Ownership does not permit bypassing shared contracts or reviews.

## Phase 0 — Documentation and validation

- Approve product scope, SRS, HLD, LLD, and privacy assumptions.
- Confirm institutional-domain authentication behavior.
- Create threat model, ERD, API examples, wireframes, and demo scenarios.
- Define coding standards and branch/review workflow.

Exit: no unresolved architecture decision blocks repository scaffolding.

## Phase 1 — Foundation

- Monorepo, Next.js, Express, worker, and shared contract packages
- CI quality gates
- Supabase Auth and profile onboarding
- PostgreSQL migrations and RLS baseline
- Structured logging, correlation IDs, and health endpoints

Exit: verified member can sign in and retrieve only their authorized profile data.

## Phase 2 — Core social platform

- Media upload sessions and quarantine storage
- Posts, reels, comments, reactions, saves, follows, and blocks
- Communities and approval workflow
- Discovery/following feeds with initial deterministic ranking

Exit: complete campus social flow works without asynchronous optimization.

## Phase 3 — Event architecture and moderation

- Transactional outbox
- Kafka broker, publisher, consumers, retries, and dead-letter topic
- Redis caching, rate limits, locks, and trending sets
- Media processing and moderation adapter
- Admin queue, decisions, appeals, and audit log

Exit: content survives dependency failures and flagged media remains private.

## Phase 4 — Messaging and Realtime

- Direct and group conversations
- Text/media moderation
- Realtime delivery, presence, typing, and receipts
- Message reports, blocks, and notification aggregation

Exit: only authorized participants can retrieve or receive conversation data.

## Phase 5 — Stories

- Story upload, expiry, viewer tracking, replies, polls, and highlights
- Cleanup and recovery jobs
- Story privacy and reporting

Exit: Stories expire reliably across worker restarts and highlights persist.

## Phase 6 — Scale demonstration

- PostgreSQL read replica and consistency router
- Full Docker topology
- Prometheus/Grafana dashboards
- Load, resilience, and recovery tests
- Architecture demonstration script

Exit: the team demonstrates Kafka retry, Redis degradation, replica fallback, and preserved data.

## Definition of done

A feature is complete when:

- Requirements and acceptance cases are linked.
- API and event schemas are versioned.
- Authorization and validation are implemented.
- Unit, integration, and applicable E2E tests pass.
- Loading, empty, error, and accessibility states exist.
- Logs and metrics support diagnosis.
- Documentation is updated.
- Another team member has reviewed the change.

## Principal risks

| Risk | Mitigation |
| --- | --- |
| Excessive scope | Treat core social/moderation as the first releasable product; stage DMs and Stories |
| Distributed-system complexity | Keep one modular API and one worker deployable; use contracts and adapters |
| Free-tier limits | Support local infrastructure and deterministic mocks |
| Video processing cost | Strict upload limits and asynchronous processing |
| Moderation false positives | Human review, reason capture, and appeals |
| Privacy mistakes | RLS, policy tests, private buckets, and limited moderator access |
| Replica inconsistency | Explicit consistency classification and primary fallback |
| Team integration problems | Feature ownership, ADRs, shared contracts, and continuous integration |
