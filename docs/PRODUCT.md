# Product Definition

## Vision

Create a safe, private digital campus where verified TIET members can discover short videos, share campus life, participate in communities, and communicate without opening the network to external accounts.

The product is inspired by interaction patterns from short-video and photo-sharing applications. It must not copy their branding or claim to use their proprietary ranking systems.

## Users and roles

- **Member:** verified `@thapar.edu` user who can create content, interact, join communities, message, report, and control visibility.
- **Admin:** trusted student moderator who reviews reports, moderation flags, and community requests.
- **Super admin:** system owner who manages administrative roles, permanent bans, global policy, and audit access.

Public profiles use a chosen username and display name. Institutional email addresses remain private.

## Core capabilities

1. Google sign-in restricted to verified `@thapar.edu` accounts.
2. Vertical reel feed and normal image/video posts.
3. Profiles, follows, likes, comments, saves, mentions, hashtags, and blocks.
4. Campus, followers-only, and community-only visibility.
5. Student-requested communities approved by administrators.
6. One-to-one and group messaging with text and moderated media.
7. Stories with expiry, views, replies, highlights, mentions, and polls.
8. Automated content screening followed by human review for flagged content.
9. In-app notifications and a moderation/admin dashboard.
10. Explainable ranking based on freshness, affinity, engagement, watch behavior, and community relevance.

## Explicit exclusions

- Public registration outside TIET
- Livestreaming
- Advertising and payments
- Music licensing or a commercial music catalogue
- Event ticketing
- End-to-end encrypted messaging
- Training a custom recommendation or moderation model
- Automatic cross-posting to Instagram or TikTok

## Product success criteria

- Unauthorized accounts cannot complete onboarding.
- A new member can reach relevant campus content without following anyone.
- Clean content can publish without human delay; suspicious content is held privately.
- A moderator can understand why content was flagged and record a decision.
- Private content and messages are inaccessible to unrelated users.
- Core user journeys work on a phone-sized browser and install as a PWA.
- Loss of Kafka, Valkey, or a worker does not lose authoritative user data.

## Product identity

The visual direction takes cues from TIET's brick architecture, sandstone surfaces, campus notice boards, and student culture. The interface uses a restrained brick-red and sandstone palette with a blue live-state accent. A “campus pulse” treatment communicates trending activity without reproducing another platform's visual identity.
