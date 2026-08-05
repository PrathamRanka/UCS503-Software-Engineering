# Incident Runbook

## First response

1. Open an incident record with time, reporter, affected environment, and correlation IDs.
2. Classify severity using `OPERATIONS.md`.
3. Stop ongoing harm: disable a feature flag, revoke a credential, isolate a worker, or place the application in read-only mode.
4. Preserve relevant logs, audit records, event offsets, and database snapshots.
5. Assign incident lead, communications owner, and investigator.

## Credential exposure

1. Revoke or rotate the exposed credential immediately.
2. Search logs and repository history for use and exposure scope.
3. Invalidate affected sessions if signing/session material was exposed.
4. Review administrative and storage activity.
5. Remove the secret from current files and history through an approved process.
6. Document root cause and preventive control.

## Unauthorized data access

1. Disable the affected endpoint or policy.
2. Preserve request, database, and audit evidence.
3. Identify affected users and fields.
4. Correct authorization and add a regression test before re-enabling.
5. Escalate to the project supervisor and institutional contact before any real-user communication.

## Event backlog

1. Check outbox age, Kafka broker health, partition availability, and consumer lag.
2. Pause nonessential producers if storage pressure is increasing.
3. Restart only unhealthy consumers; do not delete offsets.
4. Inspect dead-letter records and replay only after fixing the consumer.
5. Confirm idempotency and downstream consistency.

## Harmful content emergency

1. Hide the target content without destroying evidence.
2. Restrict the case to super admins.
3. Suspend involved accounts temporarily if continuing harm is likely.
4. Follow the approved institutional escalation path.
5. Avoid downloading or redistributing sensitive evidence unnecessarily.

## Closure

The incident closes only after service restoration, data-integrity checks, user-impact assessment, permanent corrective action, regression tests, and a blameless review with assigned follow-up owners.
