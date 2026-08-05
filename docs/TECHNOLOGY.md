# Technology and Cost Baseline

## Policy

The complete project must run without a paid subscription. Mandatory components are free/open-source and runnable locally. A hosted free tier may improve convenience, but losing that tier must not prevent development, testing, or demonstration.

Package versions are pinned exactly in `pnpm-lock.yaml` once scaffolding starts. Renovate Community Edition may propose upgrades; security patches are reviewed weekly. Major upgrades require an ADR and full regression run.

## Application baseline

| Area | Decision | Version line | Cost decision |
| --- | --- | --- | --- |
| Runtime | Node.js LTS | 24.x | Free/open-source |
| Package manager | pnpm | 10.x | Free/open-source |
| Frontend | Next.js App Router | patched 16.2.x | Free/open-source |
| UI runtime | React | compatible 19.x | Free/open-source |
| Backend | Express | 5.x | Free/open-source |
| Language | TypeScript strict mode | 5.x | Free/open-source |
| Validation | Zod | current compatible major | Free/open-source |
| Client server-state | TanStack Query | current compatible major | Free/open-source |
| UI styling | Tailwind CSS | current compatible major | Free/open-source |
| Testing | Vitest, Supertest, Playwright, k6 | pinned in lockfile | Free/open-source |

Next.js security advisories are treated as urgent because the frontend is internet-facing. The minimum accepted release is the current patched release in the selected stable line; downgrading below a security fix is prohibited.

## Infrastructure baseline

| Capability | Mandatory implementation | Optional adapter |
| --- | --- | --- |
| Identity/database/storage/realtime | Self-hosted Supabase | Supabase free hosted project |
| Event stream | Apache Kafka in KRaft mode | Compatible managed Kafka |
| Cache/rate limits/locks | Valkey | Redis-compatible managed service |
| Malware scanning | ClamAV | Commercial scanner |
| Video/image processing | FFmpeg and Sharp | Managed media pipeline |
| Visual NSFW screening | `Falconsai/nsfw_image_detection` local model | Hive or another hosted provider |
| Toxic text screening | Detoxify `unbiased` local model | Hosted text moderation |
| OCR | Tesseract OCR | Hosted OCR |
| Audio transcription | whisper.cpp or equivalent local Whisper runtime | Hosted transcription |
| Metrics | Prometheus | Hosted metrics |
| Dashboards | Grafana OSS | Hosted Grafana |
| Tracing | OpenTelemetry | Hosted tracing backend |
| CI | GitHub Actions where quota permits, otherwise local scripts | Paid CI runner |

## Moderation runtime

Moderation is an isolated Python 3.12/FastAPI sidecar because the selected free ML models and media libraries are better supported there. Express and Node workers remain the application backend; the sidecar is a private inference dependency rather than a public business API. It is never internet-accessible.

Video processing sequence:

1. ClamAV scan.
2. FFprobe validation.
3. Frame sampling every two seconds plus scene-change frames.
4. Visual classifier on sampled frames.
5. Tesseract OCR on representative frames.
6. Audio transcription when audio exists.
7. Text toxicity/abuse classification.
8. Policy engine combines findings.
9. FFmpeg creates 360p and 720p HLS renditions plus a poster image.

This is suitable for a classroom demonstration, not a claim that local models equal commercial safety systems.

## Search and feature flags

- Search uses PostgreSQL full-text search and `pg_trgm`; Elasticsearch/OpenSearch is not required.
- Feature flags use a database `feature_flags` table plus environment kill switches.
- Flags are evaluated server-side for permissions and client-side only for presentation.
- Every unfinished feature defaults off in production-like environments.

## Media compatibility

- Accepted input: JPEG, PNG, WebP, MP4, MOV, and WebM after signature verification.
- Published images: WebP plus original-safe fallback where required.
- Published video: HLS with H.264/AAC 360p and 720p; MP4 fallback for demo compatibility.
- Maximum published frame rate: 30 fps.
- Uploaded metadata that is not needed for functionality is stripped.

## Zero-cost limitation

Free software removes license cost, not compute, storage, network, or operational cost. The complete distributed stack runs locally. A genuine public production service will eventually require funded infrastructure even though the selected software remains free/open-source.
