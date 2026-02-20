# AGENTS.md

## Repo context (nzinsure-v2)
- Next.js App Router with server routes under app/api/**
- Shared code: platform/**, shared/**
- Guard scripts: scripts/token-guard.mjs

## Commands before merging
- npm run lint
- node scripts/token-guard.mjs
- npm test (only if your repo has tests configured)

## Safety / compliance (hard rules)
- Do NOT log raw request bodies, CRM responses, auth headers, cookies, tokens, or PII.
- If any AI output exists: it must pass a rules gate before returning to users or syncing to CRM.
- Prefer smallest change set; avoid refactors unless explicitly requested.
