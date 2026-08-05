# Operations and Reliability

## Environments

| Environment | Purpose | Infrastructure |
| --- | --- | --- |
| Development | Daily feature work | Local apps, hosted Supabase, optional Kafka/Redis |
| Test | Automated integration | Disposable containers and deterministic mocks |
| Demo | Full architecture presentation | Complete Docker Compose topology |
| Production-like | Performance rehearsal | Same images and configuration model as demo |

Environment configuration is validated at process startup. Missing or contradictory values stop the process with a clear error.

## Health endpoints

Express and workers expose:

- `/health/live`: process is running.
- `/health/ready`: required dependencies are usable.
- `/health/details`: protected diagnostic view for database, replica lag, Redis, Kafka, Storage, and consumer status.

Readiness failure removes a process from service; liveness does not fail merely because an optional dependency is degraded.

## Observability

- Structured JSON logs
- Correlation ID from browser request through API, outbox, Kafka, and worker
- Metrics scraped by Prometheus and viewed in Grafana
- Traces through OpenTelemetry-compatible instrumentation
- Audit events stored separately from operational logs

Required metrics:

- Request count, latency, and error rate by route
- Authentication and rate-limit failures
- Primary/replica connection use and replica lag
- Redis latency and cache-hit ratio
- Outbox backlog and oldest pending event
- Kafka producer errors and consumer lag
- Moderation queue age and decision time
- Realtime delivery failures
- Storage upload and cleanup failures

## Alerts for a real deployment

- Elevated API error rate or latency
- Database connection exhaustion
- Replica lag beyond routing threshold
- Growing outbox or Kafka consumer backlog
- Moderation provider failure or oldest case exceeding policy
- Storage usage approaching quota
- Unusual authentication or administrative activity

## Backup and recovery

- Database backups are the recovery authority.
- Storage objects and database metadata require a reconciliation process.
- Redis is rebuilt from PostgreSQL and event replay.
- Kafka is not the sole store for business state.
- Restore exercises must validate profiles, permissions, content metadata, moderation history, and outbox consistency.

The classroom demo documents restore steps but must not claim a recovery objective that has not been measured.

## Deployment rules

- Build immutable application images.
- Run database migrations as a separate controlled step.
- Prefer backward-compatible expand/migrate/contract schema changes.
- Deploy consumers before producers when introducing new event versions.
- Include a rollback or forward-fix strategy for each release.
- Never automatically roll back a migration that may discard user data.

## Incident priorities

- SEV-1: unauthorized data access, credential exposure, destructive corruption, or platform-wide outage.
- SEV-2: major feature unavailable, moderation blocked, or sustained event backlog.
- SEV-3: degraded performance or limited non-critical failure.
- SEV-4: minor defect with a workaround.

For any security incident: contain access, preserve evidence, rotate affected credentials, assess scope, notify responsible project/institution contacts, remediate, and record a blameless review.

## Demo runbook

1. Validate Docker resources and environment configuration.
2. Start primary infrastructure, then Supabase services, then Kafka/Redis.
3. Verify database replication and Kafka topic creation.
4. Start API, publisher, worker, and web application.
5. Apply migrations and deterministic seed data.
6. Check readiness and Grafana dashboards.
7. Run smoke tests before presentation.
8. Demonstrate normal flow and one controlled dependency failure.
