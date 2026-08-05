# Documentation Index

The documents in this directory are the engineering source of truth. If implementation and documentation disagree, the discrepancy must be resolved through an architecture decision record rather than silently changing behavior.

| Document | Purpose |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Product vision, scope, users, and success criteria |
| [SRS.md](SRS.md) | Functional and non-functional software requirements |
| [HLD.md](HLD.md) | System context, major components, deployment, and data flow |
| [LLD.md](LLD.md) | Module boundaries, interfaces, workflows, and implementation rules |
| [DATA_MODEL.md](DATA_MODEL.md) | Logical schema, ownership, indexes, and retention |
| [API_AND_EVENTS.md](API_AND_EVENTS.md) | REST conventions, endpoint groups, and Kafka contracts |
| [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md) | Threat model, authorization, moderation, and privacy controls |
| [TESTING.md](TESTING.md) | Test strategy, quality gates, and acceptance scenarios |
| [OPERATIONS.md](OPERATIONS.md) | Environments, observability, recovery, and incident handling |
| [ROADMAP.md](ROADMAP.md) | Delivery phases, ownership, risks, and definition of done |
| [TECHNOLOGY.md](TECHNOLOGY.md) | Version policy and zero-cost technology decisions |
| [ERD.md](ERD.md) | Entity-relationship design and ownership boundaries |
| [USER_FLOWS.md](USER_FLOWS.md) | Sitemap and primary user journeys |
| [MODERATION_POLICY.md](MODERATION_POLICY.md) | Automated screening and human review policy |
| [GOVERNANCE_AND_DATA_RIGHTS.md](GOVERNANCE_AND_DATA_RIGHTS.md) | Terms, privacy, copyright, export, and deletion decisions |
| [CI_CD.md](CI_CD.md) | Continuous integration, delivery, and release controls |
| [MIGRATIONS.md](MIGRATIONS.md) | Database and event evolution policy |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Local development and environment setup |
| [INCIDENT_RUNBOOK.md](runbooks/INCIDENT_RUNBOOK.md) | Security and availability incident response |
| [DATABASE_RECOVERY.md](runbooks/DATABASE_RECOVERY.md) | Backup, restoration, and integrity verification |
| [ADR-001](adr/001-feature-based-modular-monolith.md) | Decision to use feature-based architecture |
| [ADR-002](adr/002-zero-cost-open-source-baseline.md) | Decision to require a zero-cost runnable baseline |

Executable contracts live outside this directory:

- `contracts/openapi.yaml`: REST API contract
- `contracts/asyncapi.yaml`: Kafka event contract
- `contracts/events/*.schema.json`: machine-readable event payload schemas
- `infra/sql/0001_initial_schema.sql`: initial PostgreSQL schema contract
- `infra/sql/0002_storage_buckets.sql`: private Storage bucket baseline
- `infra/valkey/KEYSPACE.md`: cache, rate-limit, and lock catalogue
- `.env.example`: environment configuration contract

## Document status

All documents are version `0.1` and describe the approved pre-implementation baseline. Changes affecting public interfaces, security boundaries, persistence, or deployment require an ADR.
