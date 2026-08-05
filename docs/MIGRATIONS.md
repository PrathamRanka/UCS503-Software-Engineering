# Migration and Compatibility Policy

## Database migrations

- Migrations are immutable, ordered SQL files named `YYYYMMDDHHMM_description.sql` after the initial baseline.
- A migration already applied to a shared environment is never edited; corrective work uses a new migration.
- Every migration runs inside a transaction unless PostgreSQL explicitly prohibits the operation.
- Destructive changes use expand, migrate, verify, and contract phases across separate releases.
- Large backfills run in bounded batches with progress and restart markers.
- New columns are nullable or have safe defaults before application code requires them.
- Indexes on populated large tables are created concurrently in a non-transactional migration with a documented recovery path.

## Validation

CI applies migrations to an empty database and to a fixture representing the previous release. It then validates constraints, RLS, grants, functions, triggers, and critical query plans.

Rollback means application rollback or a tested forward-fix. Migrations that may discard data do not receive automatic down scripts.

## API compatibility

- `/api/v1` remains backward compatible within the major version.
- Fields may be added but are not repurposed.
- Removing or changing required fields requires a new API major version.
- Cursor encoding is opaque and versioned internally.

## Event compatibility

- Event names end in `.vN`.
- Producers may add optional fields within a version.
- Breaking payload changes create a new event version and a transition period where producers dual-publish if required.
- Consumers ignore unknown optional fields and reject unsupported major event versions to the dead-letter topic.

## Cache compatibility

Cache keys include a schema or ranking version where interpretation can change. A deployment may abandon old keys and let TTL remove them; no migration depends on cache survival.
