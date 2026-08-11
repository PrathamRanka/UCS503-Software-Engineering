# System Architecture Diagram

## TIET Campus Social Platform

```mermaid
flowchart TB
    Users["Students / Faculty / Admins"]

    subgraph Client["Client Layer"]
        Web["Next.js PWA<br/>React + TypeScript + Tailwind"]
    end

    subgraph Application["Application Layer"]
        API["Express API<br/>Authentication, validation, authorization,<br/>rate limiting and transactions"]

        subgraph Modules["Feature-Based Modular Monolith"]
            Identity["Identity &<br/>Social Graph"]
            Content["Content, Reels<br/>& Stories"]
            Feed["Feed &<br/>Communities"]
            Messaging["Messaging &<br/>Notifications"]
            Safety["Moderation &<br/>Administration"]
        end
    end

    subgraph Platform["Data and Platform Services"]
        Auth["Supabase Auth<br/>Google OAuth + @thapar.edu"]
        Primary[("PostgreSQL Primary<br/>Source of truth + RLS")]
        Replica[("PostgreSQL Read Replica<br/>Eventual-consistency queries")]
        Cache[("Valkey<br/>Cache, rate limits, locks")]
        Storage[("Supabase Storage<br/>Quarantine + published media")]
        Realtime["Supabase Realtime<br/>Private WebSocket channels"]
    end

    subgraph Async["Asynchronous Processing"]
        Outbox["Transactional Outbox<br/>Publisher"]
        Kafka[("Apache Kafka<br/>Durable domain events")]
        Workers["Node.js Workers<br/>Media, feed, notification,<br/>cleanup and scheduled jobs"]
        Moderation["Private Moderation Sidecar<br/>FastAPI + ClamAV + ML + FFmpeg"]
    end

    subgraph Operations["Operations"]
        Observability["OpenTelemetry + Prometheus + Grafana<br/>Logs, traces, metrics and alerts"]
    end

    Users --> Web
    Web -->|"REST / JSON"| API
    Web -->|"Direct signed upload"| Storage
    Web <-->|"Presence, typing, delivery updates"| Realtime

    API --> Modules
    API -->|"Validate JWT"| Auth
    API -->|"Writes + strong reads"| Primary
    API -->|"Safe stale reads"| Replica
    API -->|"Cache / limits / idempotency"| Cache
    API -->|"Signed upload instructions"| Storage

    Primary -->|"Replicates"| Replica
    Primary -->|"Committed outbox rows"| Outbox
    Outbox -->|"Publish events"| Kafka
    Kafka -->|"Consumer groups"| Workers
    Workers -->|"Idempotent updates"| Primary
    Workers -->|"Process and publish media"| Storage
    Workers -->|"Screen content"| Moderation
    Workers -->|"Update caches"| Cache
    Workers -->|"Broadcast final state"| Realtime

    Web -.-> Observability
    API -.-> Observability
    Workers -.-> Observability

    classDef actor fill:#fff7ed,stroke:#c2410c,color:#7c2d12,stroke-width:2px;
    classDef client fill:#eff6ff,stroke:#2563eb,color:#1e3a8a,stroke-width:2px;
    classDef app fill:#f5f3ff,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;
    classDef data fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:2px;
    classDef async fill:#fefce8,stroke:#ca8a04,color:#713f12,stroke-width:2px;
    classDef ops fill:#f8fafc,stroke:#475569,color:#0f172a,stroke-width:2px;

    class Users actor;
    class Web client;
    class API,Identity,Content,Feed,Messaging,Safety app;
    class Auth,Primary,Replica,Cache,Storage,Realtime data;
    class Outbox,Kafka,Workers,Moderation async;
    class Observability ops;
```

## One-minute explanation

The platform uses a **feature-based modular monolith with event-driven workers**. Users access a Next.js progressive web application, while all business operations pass through one Express API. The API is divided into independent feature modules, which keeps the semester project manageable while preserving clear boundaries for future scaling.

PostgreSQL is the source of truth. Valkey only stores temporary or reconstructable data, such as feed caches and rate limits. Media is uploaded directly to private storage using signed instructions, but it remains quarantined until asynchronous workers and the private moderation service approve it.

Business changes and event records are committed together using the transactional outbox pattern. The outbox publisher sends durable events to Kafka, and workers handle moderation, media processing, notifications, feed updates, and cleanup. Supabase Realtime is used only for transient WebSocket updates; persistent messages and notifications remain retrievable from PostgreSQL if realtime delivery fails.

## Key design choice

This is intentionally **not a microservices architecture**. A modular monolith provides simpler deployment and database transactions for a student team, while Kafka, workers, API contracts, and strict module boundaries leave a clear path for extracting services later if usage requires it.
