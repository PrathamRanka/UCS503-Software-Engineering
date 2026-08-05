# Data Model

## Principles

- PostgreSQL is the authoritative source of truth.
- UUIDs are generated server-side.
- Mutable entities include `created_at`, `updated_at`, and an optimistic `version` where concurrent edits matter.
- User-generated content supports soft deletion followed by scheduled hard deletion.
- Emails and provider identifiers are isolated from public profile data.
- Counters are derived or asynchronously maintained and are not trusted for authorization.

## Entity groups

### Identity

- `profiles`: public identity, username, display name, biography, avatar, account state.
- `user_private`: private email/provider data linked one-to-one with a profile.
- `role_assignments`: role, assigner, reason, start and revocation metadata.
- `follows`: follower/followed relation and state.
- `blocks`: directional block relation.

### Content

- `content`: shared post/reel record, author, caption, visibility, status, timestamps.
- `media_assets`: storage key, media type, dimensions, duration, checksum, processing state.
- `content_media`: ordered content-to-asset relation.
- `reactions`, `comments`, `saves`: engagement entities.
- `hashtags`, `content_hashtags`, `mentions`: discovery and notification relations.
- `content_metrics`: asynchronously maintained counts and ranking features.
- `feed_impressions`: viewer, content, ranking version, position, watch behavior.

### Communities

- `community_requests`: proposed identity, purpose, requester, review decision.
- `communities`: approved community and owner.
- `community_memberships`: role and membership state.
- `community_rules`: ordered local rules.

### Messaging

- `conversations`: direct or group metadata.
- `conversation_participants`: membership, role, mute and last-read state.
- `messages`: sender, body, reply reference, delivery/moderation state.
- `message_media`: message-to-asset relation.
- `message_reports`: reported message and reporter-provided context.

### Stories

- `stories`: author, audience, publication and expiry timestamps.
- `story_media`: asset and overlay metadata.
- `story_views`: unique viewer and first-view timestamp.
- `story_polls`, `story_poll_votes`: poll configuration and one vote per eligible viewer.
- `highlights`, `highlight_items`: persistent author-curated collections.

### Moderation and operations

- `moderation_jobs`: provider, target, attempt, score summary, and status.
- `moderation_findings`: category, confidence, evidence reference.
- `reports`: reporter, target, category, description, status.
- `moderation_cases`: consolidated queue item and assignee.
- `moderation_decisions`: action, reason, duration, decision maker.
- `appeals`: appellant, argument, reviewer, outcome.
- `notifications`: recipient, type, actor/target references, read state.
- `admin_audit_log`: append-only privileged action history.
- `outbox_events`: transactional events awaiting Kafka publication.
- `processed_events`: consumer idempotency ledger.

## Critical constraints

- Usernames are case-insensitively unique.
- A user cannot follow or block themselves.
- Follow and block pairs are unique.
- A reaction is unique per user, content, and reaction type.
- A save is unique per user and content.
- Direct conversations have a canonical participant-pair key to prevent duplicates.
- Story views and poll votes are unique per viewer and target.
- Administrative role changes require a valid actor and reason.
- Published content must reference only approved media assets.

## Index strategy

- Partial indexes cover active, published, non-deleted content.
- Composite feed indexes begin with moderation state and visibility, followed by publication time.
- Conversation indexes support participant plus latest activity queries.
- Moderation indexes support status, priority, and oldest pending time.
- Outbox indexes support undelivered rows ordered by creation time.
- BRIN indexes may be used for append-heavy impressions and audit logs after volume justifies them.

## Retention defaults

| Data | Retention |
| --- | --- |
| Active content/messages | Until user deletion or policy action |
| Quarantine upload without submission | 24 hours |
| Expired non-highlighted Story media | 7-day recovery period |
| Soft-deleted normal content | 30 days |
| Feed impressions | 90 days at event detail, aggregates retained |
| Security and admin audit records | Minimum one academic year |
| Processed event IDs | Longer than Kafka replay window |

Exact retention must be approved before a real campus launch.
