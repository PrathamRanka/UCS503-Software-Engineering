# ADR-002: Zero-Cost Open-Source Baseline

- Status: Accepted
- Date: 2026-08-05

## Context

The project must demonstrate production-oriented components without requiring any team member to purchase infrastructure or API access. Hosted free tiers can change limits or disappear, and a paid moderation provider would make the demo non-reproducible.

## Decision

Every mandatory capability has a free/open-source local implementation. Hosted services remain optional adapters.

- Self-hosted Supabase for identity, PostgreSQL, Storage, and Realtime
- Apache Kafka for durable events
- Valkey for Redis-compatible caching, limits, and locks
- ClamAV, FFmpeg, Tesseract, local visual/text classifiers, and local speech transcription for media safety
- Prometheus, Grafana OSS, and OpenTelemetry for observability
- GitHub Actions when free quota is available, with equivalent local scripts

Valkey is selected instead of depending on Redis server licensing. Application code uses a Redis-protocol client behind a cache interface, allowing compatible providers later.

## Consequences

- The complete demo is reproducible without a subscription.
- Local infrastructure requires substantial memory and setup time.
- Local moderation is slower and less accurate than well-funded commercial systems.
- Free/open-source software does not eliminate real public-hosting costs.
- Adapters and deterministic mocks are required so lightweight development remains usable.
