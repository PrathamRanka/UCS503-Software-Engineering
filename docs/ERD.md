# Entity-Relationship Design

This diagram is the logical model. The executable baseline is `infra/sql/0001_initial_schema.sql`.

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : owns
    PROFILES ||--|| USER_PRIVATE : protects
    PROFILES ||--o{ FOLLOWS : follows
    PROFILES ||--o{ BLOCKS : blocks
    PROFILES ||--o{ ROLE_ASSIGNMENTS : receives

    PROFILES ||--o{ CONTENT : authors
    CONTENT ||--o{ CONTENT_MEDIA : contains
    MEDIA_ASSETS ||--o{ CONTENT_MEDIA : attached
    CONTENT ||--o{ COMMENTS : receives
    PROFILES ||--o{ COMMENTS : writes
    CONTENT ||--o{ REACTIONS : receives
    CONTENT ||--o{ SAVES : saved
    CONTENT ||--|| CONTENT_METRICS : summarized

    PROFILES ||--o{ COMMUNITY_REQUESTS : requests
    COMMUNITY_REQUESTS o|--o| COMMUNITIES : creates
    COMMUNITIES ||--o{ COMMUNITY_MEMBERSHIPS : includes
    PROFILES ||--o{ COMMUNITY_MEMBERSHIPS : joins
    COMMUNITIES ||--o{ CONTENT : scopes

    CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : includes
    PROFILES ||--o{ CONVERSATION_PARTICIPANTS : participates
    CONVERSATIONS ||--o{ MESSAGES : contains
    PROFILES ||--o{ MESSAGES : sends
    MESSAGES ||--o{ MESSAGE_MEDIA : contains
    MEDIA_ASSETS ||--o{ MESSAGE_MEDIA : attached

    PROFILES ||--o{ STORIES : authors
    STORIES ||--o{ STORY_VIEWS : viewed
    PROFILES ||--o{ STORY_VIEWS : views
    STORIES ||--o{ STORY_POLLS : includes
    STORY_POLLS ||--o{ STORY_POLL_VOTES : receives
    PROFILES ||--o{ HIGHLIGHTS : owns
    HIGHLIGHTS ||--o{ HIGHLIGHT_ITEMS : contains
    STORIES ||--o{ HIGHLIGHT_ITEMS : retained

    PROFILES ||--o{ REPORTS : files
    REPORTS }o--|| MODERATION_CASES : contributes
    MODERATION_CASES ||--o{ MODERATION_DECISIONS : receives
    MODERATION_DECISIONS ||--o{ APPEALS : challenged
    MEDIA_ASSETS ||--o{ MODERATION_JOBS : scanned

    PROFILES ||--o{ NOTIFICATIONS : receives
    PROFILES ||--o{ ADMIN_AUDIT_LOG : acts
    OUTBOX_EVENTS ||--o{ PROCESSED_EVENTS : consumed
```

## Ownership boundaries

- Identity owns profiles, private identity data, roles, follows, and blocks.
- Content owns posts, reels, media relations, comments, reactions, saves, and metrics.
- Communities owns requests, communities, memberships, and rules.
- Messaging owns conversations, participants, messages, and read state.
- Stories owns ephemeral publication, views, polls, and highlights.
- Moderation owns scans, findings, reports, cases, decisions, and appeals.
- Platform owns notifications, feature flags, outbox, idempotency, and audit records.

Modules may reference another module's public identifier, but only the owning module writes that entity. Cross-module state changes use declared services or events.

## Sensitive-data separation

`profiles` contains campus-visible data. `user_private` contains email, provider identity, export status, and deletion metadata. It is never joined into public profile queries. Message bodies and moderation evidence are excluded from analytics and general Kafka topics.
