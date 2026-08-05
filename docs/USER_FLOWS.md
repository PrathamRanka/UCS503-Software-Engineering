# Sitemap and User Flows

## Sitemap

```text
Public
  /login
  /auth/callback
  /legal/terms
  /legal/privacy

Member application
  /onboarding
  /feed/discover
  /feed/following
  /reels
  /create
  /communities
  /communities/[slug]
  /messages
  /messages/[conversationId]
  /stories/[storyId]
  /notifications
  /profile/[username]
  /settings/account
  /settings/privacy
  /settings/data

Administration
  /admin/moderation
  /admin/community-requests
  /admin/users
  /admin/audit
  /admin/feature-flags
```

## Authentication and onboarding

```mermaid
sequenceDiagram
    participant U as User
    participant W as Next.js
    participant A as Supabase Auth
    participant API as Express API
    participant DB as PostgreSQL
    U->>W: Continue with Google
    W->>A: OAuth request
    A-->>W: Verified session
    W->>API: POST /onboarding
    API->>API: Verify JWT and @thapar.edu
    API->>DB: Create private identity and profile
    DB-->>API: Profile
    API-->>W: Onboarding complete
```

Sessions use short-lived access tokens and refresh tokens managed by Supabase. A member must reauthenticate at least every 30 days for the pilot. Disabled, suspended, or banned profiles are denied even when a token remains cryptographically valid.

## Content upload and moderation

```mermaid
sequenceDiagram
    participant W as Next.js
    participant API as Express
    participant S as Storage
    participant DB as PostgreSQL
    participant K as Kafka
    participant M as Moderation worker
    W->>API: Request signed resumable upload
    API-->>W: Quarantine object key and token
    W->>S: TUS resumable upload
    W->>API: Submit content and checksum
    API->>DB: Content pending_scan + outbox event
    DB-->>K: Outbox publisher sends event
    K-->>M: content.submitted.v1
    M->>S: Read private object
    M->>M: Malware, NSFW, OCR, audio and media processing
    M->>DB: Approved, review, or rejected
    M-->>W: Realtime status update
```

## Account export and deletion

- Export: member confirms the request; a worker generates JSON metadata and signed media links; download expires after 72 hours.
- Deletion: member reauthenticates, sees consequences, and enters a 30-day recoverable deletion period.
- During the deletion period the profile is hidden and login can restore the account.
- After 30 days, private identity data and owned content are removed or anonymized according to conversation, audit, appeal, and legal-retention rules.
- Messages retained for other participants show a deleted-user tombstone and no profile link.

## Infinite feeds

- Express returns opaque cursor pagination.
- TanStack Query stores bounded pages.
- IntersectionObserver prefetches before the final item.
- Reels use scroll snapping, one active player, and DOM virtualization.
- The browser reports watch events in batches; it never blocks scrolling on analytics submission.
