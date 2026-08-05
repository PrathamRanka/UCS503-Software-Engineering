# Valkey Keyspace Contract

All keys are prefixed by `{VALKEY_KEY_PREFIX}`. Permanent business data is prohibited.

| Pattern | Type | TTL | Owner | Purpose |
| --- | --- | --- | --- | --- |
| `rate:{scope}:{actor}:{window}` | string counter | window + 60s | API | Distributed rate limit |
| `feed:{version}:{viewer}:{cursorHash}` | string JSON | 60s | Feed | Ranked feed page cache |
| `profile:{profileId}` | string JSON | 5m | Identity | Campus-visible profile cache |
| `community:{communityId}` | string JSON | 5m | Communities | Community summary cache |
| `trending:{scope}:{period}` | sorted set | 2x period | Feed worker | Trending candidate scores |
| `idem:{actor}:{key}` | hash | 24h | API | Retry result and request fingerprint |
| `lock:{resource}:{id}` | string token | max 30s | Workers | Short critical-section lease |
| `presence-summary:{conversationId}` | set | 60s | Messaging | Non-authoritative presence summary |
| `feature-flags:{environment}` | string JSON | 30s | Platform | Server-side flag snapshot |

## Rules

- Never use wildcard key scans in request paths.
- Locks require unique tokens and compare-and-delete release.
- Cache values include schema version and authorization-neutral data only.
- A cache hit never skips block, visibility, membership, or moderation checks.
- Rate limits fail closed for high-risk admin/upload actions and may fail open with local fallback for low-risk reads.
- Flush/restart must not affect permanent correctness.
