**Structure**
1. `app/` is the primary Next.js App Router surface.
   - UI entry points: `app/layout.tsx`, `app/page.tsx`, `app/icura/page.tsx`
   - API routes: `app/api/auth/*`, `app/api/events/route.ts`, `app/api/health/route.ts`, `app/api/lead/route.ts`
2. `modules/` contains feature modules/plugins (dashboard, advisory, admin-console, advisor-workbench, client-portal), with local services/workflow code.
3. `platform/` contains shared platform concerns: auth, role model, service registry/container, telemetry, config, data client.
4. `lib/` contains utility logic (`lib/rules.ts`, `lib/stateEngine.ts`, `lib/redis-idempotency.ts`).
5. `shared/`, `core/`, `components/`, `design-tokens/`, `docs/` provide UI system and docs.
6. There is also a second nested app copy in `nzinsure-v2/` (duplicate `app/`, `package.json`, etc.), which looks like a parallel scaffold.

**Top Risks**
1. Critical auth bypass risk: login trusts caller-supplied `uid` and `role` and directly issues a session cookie, with no password/OIDC/token verification (`app/api/auth/login/route.ts:83`, `app/api/auth/login/route.ts:90`, `app/api/auth/login/route.ts:103`).
2. Rules gate coverage gap: `enforceRulesGate` is only used in `app/api/events/route.ts:10`; it is not applied in high-impact flows like `app/api/lead/route.ts` and auth responses, despite repo rule requiring all AI outputs to pass rules.
3. Architecture mismatch with stated backend expectation: repo guidelines say backend is FastAPI, but this workspace has no Python backend files and uses Next API routes only (`AGENTS.md`, no `*.py` files found).
4. Business logic in module layer, not API layer: advisory state/store/transition logic lives in module service with in-memory global store (`modules/advisory/services/advisory-service.ts:15`, `modules/advisory/services/advisory-service.ts:97`), conflicting with repo expectation.
5. Reliability/control risk in idempotency: if Redis config is missing, lock acquisition returns `true` (fail-open), reducing duplicate-submission protection (`lib/redis-idempotency.ts:26`).
6. Repository drift risk: duplicated nested project (`nzinsure-v2/...`) can cause conflicting edits/build targets and deployment confusion.
7. Verification gap: no test suite detected and CI workflows focus on token guard/Codex review rather than behavioral tests (`package.json` scripts, `.github/workflows/token-check.yml`).
