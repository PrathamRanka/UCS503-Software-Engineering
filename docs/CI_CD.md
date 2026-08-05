# CI/CD and Release Controls

## Zero-cost approach

GitHub Actions is used when repository quota permits. Every workflow also has an equivalent `pnpm` command so validation can run locally without a hosted runner.

## Pull-request pipeline

1. Verify lockfile integrity with `pnpm install --frozen-lockfile`.
2. Check formatting and lint rules.
3. Run TypeScript project references.
4. Validate OpenAPI, AsyncAPI, JSON Schema, SQL formatting, and migration ordering.
5. Run unit tests with coverage.
6. Start disposable PostgreSQL, Kafka, and Valkey services.
7. Run API/RLS/outbox/consumer integration tests.
8. Build Next.js, Express, and worker artifacts.
9. Run dependency, secret, container, and source scans using free tools.

Security tools: Gitleaks for secrets, Trivy for dependencies/images, Semgrep Community rules for source analysis, and OWASP ZAP baseline against a running test environment.

## Main-branch pipeline

- Repeat all pull-request checks.
- Build immutable container images tagged with commit SHA.
- Generate an SBOM.
- Run database migration smoke tests on an empty database and a previous-version fixture.
- Run Playwright critical journeys.
- Publish artifacts only after all required checks pass.

## Release process

- Use semantic application versions and date-stamped database migrations.
- Create release notes covering schema, API, event, privacy, and operations changes.
- Apply expand/migrate/contract database changes across separate releases.
- Deploy consumers before producers when introducing new event versions.
- Keep unfinished features disabled with server-side flags.
- Record rollback or forward-fix instructions.

## Branch policy

- `main` is protected and always expected to pass required checks.
- Work occurs in short-lived feature branches.
- At least one teammate reviews each change; security/authorization changes require the designated backend reviewer.
- Direct pushes to `main`, committed secrets, and unreviewed migration edits are prohibited.

## Supply-chain policy

- Commit the lockfile.
- Pin workflow actions and container images to immutable versions/digests where practical.
- Reject install scripts from unnecessary dependencies.
- Review dependencies with no recent maintenance or unclear licenses.
- Critical security updates bypass the normal release cadence but still receive tests and review.
