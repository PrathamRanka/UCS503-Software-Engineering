# Governance and Data Rights

## Project status

The application is an academic project and must not represent itself as an official TIET platform without written institutional authorization. TIET names, marks, email integration, and campus deployment require approval before a public pilot.

## Required member notices

Before onboarding, members must accept versioned Terms of Use, Privacy Notice, and Community Guidelines. Consent records store document version, timestamp, user, and request metadata. Material changes require renewed acceptance.

## Account eligibility

- Access requires a verified active `@thapar.edu` identity.
- The system rechecks eligibility during reauthentication and denies suspended application accounts immediately.
- Graduation or institutional account removal starts account offboarding; members may request export before final deletion when possible.
- Email-domain ownership does not grant administrative privileges.

## Data rights

### Export

Members can request an export containing profile data, owned content metadata, comments, reactions, communities, moderation decisions, and message history they are entitled to view. The export is generated asynchronously, encrypted at rest, and available through a 72-hour signed download.

### Correction

Members can edit profile information and request correction of immutable moderation or identity records through support. Historical audit records are appended with corrections rather than rewritten.

### Deletion

- Account deletion requires recent authentication.
- A 30-day recovery period begins immediately.
- Public/profile visibility is removed during recovery.
- After the period, owned content and private identity are deleted unless a documented security, appeal, or institutional-retention obligation applies.
- Messages visible to other participants are retained as anonymized tombstones where deleting them would alter conversation integrity.
- Audit records retain pseudonymous actor references for one academic year.

## Copyright and impersonation

- Members affirm they have permission to upload content.
- Rights holders can submit a takedown request identifying the work, content URL/ID, ownership basis, and contact information.
- Content is hidden during credible review and restored if the claim is invalid.
- Repeat deliberate infringement may result in suspension.
- Impersonation reports receive priority review; parody or fan accounts must not mislead users.

No commercial music catalogue is included. Members may upload only audio they own or are permitted to use.

## Moderator governance

- Admin appointment requires super-admin approval and recorded reason.
- Moderators receive documented training and use individual accounts.
- Shared admin credentials are prohibited.
- Moderators cannot decide reports involving themselves.
- Admin activity is periodically reviewed for unusual access or reversal patterns.

## Retention decisions

| Record | Default retention |
| --- | --- |
| Quarantine uploads never submitted | 24 hours |
| Export archives | 72 hours |
| Expired non-highlighted Stories | 7-day recovery, then deletion |
| Soft-deleted content/accounts | 30 days |
| Detailed feed impressions | 90 days |
| Processed-event idempotency keys | 30 days or longer than Kafka retention |
| Security and admin audit | One academic year |
| Moderation evidence | 90 days after case closure unless appealed |

These values are project defaults and require institutional/legal review before a real launch.
