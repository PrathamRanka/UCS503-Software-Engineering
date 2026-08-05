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
| [ADR-001](adr/001-feature-based-modular-monolith.md) | Decision to use feature-based architecture |

## Document status

All documents are version `0.1` and describe the approved pre-implementation baseline. Changes affecting public interfaces, security boundaries, persistence, or deployment require an ADR.
