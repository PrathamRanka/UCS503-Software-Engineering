# Low-Level Design

## 1. Repository organization

```text
apps/
  web/src/
    app/                    Next.js routes and layouts
    features/               Feature UI and client behavior
    components/             Shared presentational primitives
    lib/                    API, auth, realtime, and telemetry clients
  api/src/
    app/                    Express composition and middleware
    features/               Backend feature modules
    infrastructure/         Database, Kafka, Redis, storage, telemetry
    shared/                 Errors, validation, IDs, clocks, pagination
  worker/src/
    consumers/              Kafka consumer modules
    jobs/                   Scheduled database-leased jobs
    infrastructure/         Worker clients and telemetry
packages/
  contracts/                Zod schemas and generated TypeScript types
  config/                   Shared tooling configuration
  testing/                  Factories, fixtures, and container helpers
infra/docker/               Local topology and observability
```

## 2. Feature-based architecture

MVC is not the top-level architecture. Each feature is a vertical slice:

```text
features/content/
  content.routes.ts
  content.controller.ts
  content.service.ts
  content.repository.ts
  content.policy.ts
  content.schemas.ts
  content.events.ts
  content.errors.ts
  content.test.ts
```

- **Route:** binds HTTP method, middleware, and controller.
- **Controller:** translates HTTP input/output; contains no business rules.
- **Service:** coordinates a use case and transaction.
- **Policy:** answers authorization questions.
- **Repository:** owns persistence queries for the feature.
- **Schema:** validates transport inputs and outputs.
- **Event definition:** describes versioned facts emitted by the feature.

Features may depend on shared primitives and declared feature interfaces. They must not import another feature's repository or database tables directly.

## 3. Backend modules

| Module | Responsibilities |
| --- | --- |
| Identity | onboarding, username, roles, account status |
| Social graph | follows, blocks, relationship checks |
| Content | posts, reels, comments, reactions, saves |
| Feed | candidates, ranking, impressions, watch events |
| Communities | requests, memberships, local moderation |
| Messaging | conversations, participants, messages, receipts |
| Stories | active Stories, viewers, polls, highlights, expiry |
| Moderation | scans, reports, cases, decisions, appeals |
| Notifications | notification creation, aggregation, read state |
| Administration | role changes, bans, audit search, system policy |

## 4. Express request pipeline

Middleware order is fixed:

1. Request and correlation ID
2. Security headers and CORS
3. Structured request logging
4. Body size and content-type limits
5. Supabase JWT authentication
6. Account-status enforcement
7. Global and route-specific rate limits
8. Zod request validation
9. Controller and application service
10. Response serialization
11. Central error mapping

Controllers return typed results and delegate HTTP status mapping to shared responders. Internal exceptions are never sent directly to clients.

## 5. Database access

Create three explicit database clients:

- `primaryUserDb`: primary connection with request JWT claims and RLS context.
- `replicaUserDb`: read-only connection with the same RLS context.
- `systemDb`: primary privileged connection restricted to workers and administrative infrastructure.

Every use case declares its consistency requirement:

```ts
type Consistency = "strong" | "eventual";
```

The query router uses the replica only for `eventual` queries when health and lag are acceptable. Transactions always use the primary.

## 6. Transactional outbox

Business services do not publish directly to Kafka.

```text
BEGIN
  update domain tables
  insert outbox_events
COMMIT
```

The publisher claims outbox rows with `FOR UPDATE SKIP LOCKED`, publishes them, and marks them delivered. Rows retain delivery attempts and the last error. Event consumers record processed event IDs before committing external effects.

## 7. Event handling

Initial event types include:

- `content.submitted.v1`
- `content.moderation_completed.v1`
- `content.published.v1`
- `engagement.recorded.v1`
- `message.submitted.v1`
- `message.delivered.v1`
- `story.published.v1`
- `story.expired.v1`
- `community.requested.v1`
- `notification.requested.v1`

Ordering is guaranteed only within the selected aggregate partition key. Consumers must tolerate duplicates, delayed events, and newer unknown event versions.

## 8. Redis key conventions

```text
rate:{scope}:{actor}:{window}
feed:{feedVersion}:{viewerId}:{cursorHash}
trending:{campus}:{period}
idem:{actorId}:{idempotencyKey}
lock:{resourceType}:{resourceId}
```

Keys must include a bounded TTL. Cache invalidation is triggered by domain events; stale cache remains subject to authorization filtering.

## 9. Realtime channels

Private channel names:

```text
user:{userId}
conversation:{conversationId}
content:{contentId}
moderation:{userId}
```

The API issues or validates channel access based on current membership. Presence and typing events are ephemeral and never treated as authoritative. Messages and notifications are persisted before broadcast.

## 10. Feed ranking

Version-one normalized score:

```text
score =
  0.30 * freshness
  + 0.25 * authorAffinity
  + 0.20 * engagementVelocity
  + 0.15 * completionRate
  + 0.10 * communityRelevance
  - reportPenalty
  - repetitionPenalty
```

Before scoring, candidates are filtered by account status, visibility, community membership, blocks, moderation state, and deletion state. Ranking versions are stored with impression records to make evaluation reproducible.

## 11. Media rules

| Media | Limit |
| --- | --- |
| Reel | 60 seconds, 50 MB |
| Story video | 15 seconds, 15 MB |
| Image | 8 MB |
| Message attachment | 20 MB |

Clients request upload sessions containing an object key, accepted MIME types, maximum size, checksum, and expiry. Workers verify the actual file signature and metadata rather than trusting browser MIME declarations.

## 12. Error contract

```json
{
  "error": {
    "code": "CONTENT_NOT_VISIBLE",
    "message": "This content is unavailable.",
    "requestId": "req_...",
    "details": {}
  }
}
```

Error codes are stable public contracts. Messages may change for clarity. Sensitive authorization failures use non-enumerating responses.
