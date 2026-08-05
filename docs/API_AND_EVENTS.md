# API and Event Contracts

## REST conventions

- Base path: `/api/v1`
- JSON request and response bodies
- Bearer token authentication using Supabase JWTs
- Cursor pagination for changing collections
- `Idempotency-Key` required for retryable creation commands
- ISO 8601 UTC timestamps
- Stable machine-readable error codes
- Zod schemas in `packages/contracts` generate shared TypeScript types

## Endpoint groups

### Identity and profiles

```text
POST   /onboarding
GET    /profiles/:username
PATCH  /me/profile
POST   /profiles/:id/follow
DELETE /profiles/:id/follow
POST   /profiles/:id/block
DELETE /profiles/:id/block
```

### Content and feed

```text
POST   /uploads
POST   /content
GET    /content/:id
DELETE /content/:id
POST   /content/:id/reactions
DELETE /content/:id/reactions/:type
POST   /content/:id/comments
POST   /content/:id/save
DELETE /content/:id/save
GET    /feeds/discover
GET    /feeds/following
POST   /feed-events
```

### Communities

```text
POST   /community-requests
GET    /communities/:slug
POST   /communities/:id/memberships
DELETE /communities/:id/memberships/me
GET    /admin/community-requests
POST   /admin/community-requests/:id/decision
```

### Messaging and Stories

```text
POST   /conversations
GET    /conversations
GET    /conversations/:id/messages
POST   /conversations/:id/messages
POST   /conversations/:id/read
POST   /stories
GET    /stories/feed
POST   /stories/:id/views
POST   /stories/:id/replies
POST   /highlights
```

### Moderation and administration

```text
POST   /reports
GET    /moderation/cases
POST   /moderation/cases/:id/decision
POST   /moderation/decisions/:id/appeals
GET    /admin/audit-log
POST   /admin/users/:id/roles
POST   /admin/users/:id/suspensions
```

## Pagination contract

```json
{
  "data": [],
  "page": {
    "nextCursor": "opaque-or-null",
    "hasMore": false
  }
}
```

Cursors are opaque, signed where manipulation would expose data, and never constructed by clients.

## Event envelope

```ts
interface DomainEvent<TPayload> {
  eventId: string;
  eventType: string;
  version: number;
  aggregateId: string;
  actorId?: string;
  occurredAt: string;
  correlationId: string;
  payload: TPayload;
}
```

## Topic ownership

| Topic | Producer | Consumers |
| --- | --- | --- |
| `content.events` | Content module | moderation, feed, notifications |
| `moderation.events` | Moderation worker/module | content, messaging, notifications |
| `engagement.events` | Feed/content modules | feed aggregation, notifications |
| `messaging.events` | Messaging module | moderation, realtime delivery, notifications |
| `community.events` | Community module | notifications, audit |
| `notification.events` | Application modules | notification worker |
| `system.dead-letter` | Any consumer | operations tooling |

## Compatibility rules

- Existing fields are never repurposed.
- New optional fields may be added within an event version.
- Breaking changes create a new event version.
- Consumers ignore unknown optional fields.
- Events contain identifiers and necessary facts, not unrestricted database snapshots or private emails.
- Sensitive message content is not copied into general analytics topics.
