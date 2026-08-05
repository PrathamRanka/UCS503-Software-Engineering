# Security and Privacy

## Security objectives

1. Only verified TIET identities enter the network.
2. Users access only content allowed by relationship, visibility, and community rules.
3. Administrative power is limited, attributable, and reviewable.
4. Untrusted uploads never become public before validation and moderation.
5. Failure of cache, event, or realtime systems cannot bypass authorization.

## Trust boundaries

- The browser is untrusted.
- Next.js public environment values contain no service credentials.
- Express authenticates every protected request independently.
- Supabase PostgREST is not exposed through the public gateway; browsers reach Auth, signed Storage, and authorized Realtime channels only.
- Kafka payloads and worker inputs are treated as untrusted serialized data and validated.
- Valkey is not an authorization source.
- Only workers and narrowly scoped administrative paths use privileged database credentials.

## Authentication

- Google OAuth is handled by Supabase Auth.
- Onboarding requires `email_verified` and an exact normalized `@thapar.edu` suffix.
- Domain checks occur server-side; UI checks provide guidance only.
- JWT issuer, audience, signature, expiry, and subject are validated.
- Account state is checked after token validation so suspension takes effect without waiting for token expiry.

## Authorization

- Feature policies perform application authorization.
- Database RLS provides defense in depth.
- Community moderator roles never imply platform admin roles.
- Admins cannot promote themselves or create super admins.
- Super-admin operations require reauthentication for a future real launch.
- Object-storage paths are private by default and accessed with short-lived signed URLs.

## Abuse controls

- Rate limits apply by user, IP, action, and resource where appropriate.
- Creation endpoints use idempotency keys.
- Login, onboarding, upload, message, follow, comment, report, and admin actions have separate limits.
- Blocks are enforced in feed, search, profile, messaging, mentions, and notifications.
- Report submission is protected against duplicate and malicious report flooding.

## Upload security

- Quarantine and published media use separate buckets or prefixes with separate policies.
- The server defines object keys; clients cannot choose arbitrary paths.
- Workers verify file signatures, dimensions, duration, and checksums.
- Unsupported active formats such as HTML and SVG uploads are rejected.
- Filenames are never rendered as trusted markup.
- Metadata is stripped where practical before publication.

## Moderation privacy

- Automated findings store category and score rather than unnecessary copies of content.
- Private messages are not generally browsable by moderators.
- A reported message case exposes the reported message and a limited, documented context window.
- Every moderator access and decision is audited.
- Mock moderation is visibly identified in demo environments.

## Major threats and controls

| Threat | Primary controls |
| --- | --- |
| External account registration | Verified provider email plus server-side domain enforcement |
| Broken object-level authorization | Feature policies, RLS, negative integration tests |
| XSS in captions/messages | React escaping, text-only rendering, sanitization for any rich text |
| CSRF | Bearer tokens, strict CORS, SameSite settings for any cookies |
| Malicious media | Quarantine, signature checks, moderation, isolated processing |
| Credential leakage | Environment separation, secret scanning, no service role in browser |
| Kafka event forgery | Private network, schema validation, producer identity, correlation logs |
| Valkey poisoning | Namespaced keys, validation, Valkey never grants permission |
| Moderator abuse | Least privilege, immutable audit log, appeal workflow |
| User enumeration | Generic unavailable responses and limited search results |

## Privacy defaults

- Email is private.
- Profiles are visible only inside the authenticated campus network.
- Content defaults to campus visibility but supports narrower audiences.
- Realtime channels are private.
- Logs exclude tokens, raw passwords, private emails, and message bodies.
- Analytics use internal identifiers and limited retention.

## Pre-launch requirements

Before use beyond a classroom demonstration, obtain institutional approval, publish terms and privacy notices, define moderator accountability, define emergency escalation, approve retention periods, and complete an independent security review.
