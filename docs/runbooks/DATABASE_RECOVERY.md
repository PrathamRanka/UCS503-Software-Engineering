# Database Backup and Recovery Runbook

## Demonstration objectives

- Pilot RPO target: 24 hours.
- Pilot RTO target: 4 hours.
- These are unproven targets until a timed restore exercise succeeds.

## Backup schedule

- Nightly logical `pg_dump` of application schemas and roles required for RLS.
- Retain seven daily backups and four weekly backups.
- Export storage-object inventory with each database backup.
- Encrypt backup archives and store them outside the running database volume.
- Never include development secrets in a backup archive.

## Restore procedure

1. Declare maintenance mode and stop API/worker writes.
2. Record current database and Kafka offsets.
3. Provision a clean compatible PostgreSQL instance.
4. Verify backup checksum before restoration.
5. Restore extensions, schema, data, RLS policies, functions, and grants.
6. Run migrations only if restoring into a newer application version.
7. Reconcile media rows with Storage object inventory.
8. Verify outbox and processed-event consistency before consumers start.
9. Run identity, authorization, content, messaging, moderation, and audit smoke tests.
10. Rebuild Valkey caches from the restored database.
11. Start consumers, then API, then web traffic.

## Integrity checks

- Every profile references an authentication identity or approved deleted-user tombstone.
- Published content references only approved existing media.
- Conversation participants satisfy direct/group constraints.
- Role assignments and audit records retain actors and reasons.
- Undelivered outbox rows remain publishable.
- No restored private object is publicly addressable.

## Replica recovery

The read replica is disposable. Rebuild it from the primary rather than treating it as a backup. Query routing stays on the primary until replication lag is within threshold and integrity checks pass.

## Restore exercise

Run a timed restore before the final demonstration and after major schema changes. Record backup size, restore duration, failed checks, manual steps, and achieved RPO/RTO.
