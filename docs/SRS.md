# Software Requirements Specification

## 1. System scope

The system is a mobile-first progressive web application for verified TIET users. Next.js provides the user interface, Express provides the application API, and Supabase supplies identity, persistence, object storage, and realtime transport.

## 2. Functional requirements

### Identity and profiles

- FR-IDENT-001: The system shall authenticate through Google using Supabase Auth.
- FR-IDENT-002: The system shall reject users whose verified email does not end exactly with `@thapar.edu`.
- FR-IDENT-003: The system shall create one profile per authentication identity.
- FR-IDENT-004: Members shall choose a unique username and may edit approved profile fields.
- FR-IDENT-005: Only super admins shall assign or revoke administrative roles.
- FR-IDENT-006: Suspended or banned accounts shall be denied protected actions.

### Social content

- FR-CONTENT-001: Members shall create posts containing captions and supported images or videos.
- FR-CONTENT-002: Members shall create vertical reels up to 60 seconds and 50 MB.
- FR-CONTENT-003: Content visibility shall be `campus`, `followers`, or `community`.
- FR-CONTENT-004: Members shall like, comment on, save, share internally, and report eligible content.
- FR-CONTENT-005: Members shall delete their own content; deletion shall use a recoverable soft-delete period.
- FR-CONTENT-006: Blocked users shall not discover or interact with each other's content.

### Feed and discovery

- FR-FEED-001: The system shall provide ranked discovery, following, and community feeds.
- FR-FEED-002: Feed ranking shall be explainable and versioned.
- FR-FEED-003: The system shall record impressions, watch duration, completion, skips, reactions, and reports.
- FR-FEED-004: New users shall receive recent campus-trending content.
- FR-FEED-005: The system shall avoid repeatedly showing recently viewed content when alternatives exist.

### Communities

- FR-COMM-001: Members shall request creation of a community.
- FR-COMM-002: Admins shall approve, reject, or request changes to community requests.
- FR-COMM-003: Approved communities shall have owners, moderators, members, and rules.
- FR-COMM-004: Community moderators shall manage membership and community content without receiving platform-admin privileges.

### Messaging

- FR-MSG-001: Members shall create one-to-one and group conversations of up to 25 participants.
- FR-MSG-002: Conversations shall support text, replies, images, videos, read receipts, and typing state.
- FR-MSG-003: Message text and media shall pass moderation before delivery.
- FR-MSG-004: Members shall leave groups, mute conversations, block users, and report messages.
- FR-MSG-005: Moderators shall view private message context only when a participant reports a message.

### Stories

- FR-STORY-001: Members shall publish image or video Stories that expire after 24 hours.
- FR-STORY-002: Story visibility shall support campus and followers-only audiences.
- FR-STORY-003: Authors shall view Story viewers.
- FR-STORY-004: Story replies shall create or reuse a direct conversation.
- FR-STORY-005: Members shall save their own Stories to persistent highlights.
- FR-STORY-006: Version one shall support text, mention, and poll overlays.

### Moderation and administration

- FR-MOD-001: New text and media shall receive a moderation status before becoming visible.
- FR-MOD-002: Clean content shall publish automatically.
- FR-MOD-003: Flagged content shall remain private until reviewed.
- FR-MOD-004: Admins shall approve, reject, warn, suspend, and record reasons within their authority.
- FR-MOD-005: Super admins shall manage permanent bans and administrator roles.
- FR-MOD-006: Members shall appeal eligible moderation decisions.
- FR-MOD-007: Every privileged action shall create an immutable audit record.

### Notifications

- FR-NOTIF-001: The system shall create in-app notifications for follows, interactions, mentions, community decisions, moderation decisions, and messages.
- FR-NOTIF-002: Members shall mark individual or all notifications as read.
- FR-NOTIF-003: The system shall aggregate noisy reaction notifications.

## 3. Non-functional requirements

- NFR-PERF-001: Cached feed requests should complete within 300 ms at the API under normal local test load.
- NFR-PERF-002: Non-cached API reads should complete within 800 ms at p95, excluding media transfer and external moderation.
- NFR-SCALE-001: The design shall support 25,000 registered accounts and 2,000 concurrent realtime connections through horizontal scaling.
- NFR-AVAIL-001: Redis, Kafka, or worker unavailability shall degrade features without corrupting authoritative records.
- NFR-SEC-001: Every protected endpoint shall authenticate and authorize the caller.
- NFR-SEC-002: Every user-owned database table shall enforce Row Level Security or an equivalent database policy.
- NFR-SEC-003: Secrets and service credentials shall never be exposed to the browser.
- NFR-PRIV-001: Private email addresses shall not be returned in public profile APIs.
- NFR-ACC-001: Primary journeys shall meet WCAG 2.2 AA expectations.
- NFR-OBS-001: Requests and events shall carry correlation identifiers across API, Kafka, and workers.
- NFR-TEST-001: Critical identity, authorization, moderation, and messaging paths shall have automated integration tests.

## 4. Constraints

- The project initially uses only free tiers and local containers.
- Full distributed topology is demonstrated locally rather than presented as highly available production infrastructure.
- External moderation is accessed through an adapter and must have a deterministic mock implementation.
- The browser uploads media directly to signed object-storage destinations rather than proxying files through Express.
