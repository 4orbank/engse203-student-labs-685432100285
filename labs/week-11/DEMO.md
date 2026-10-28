# Week 11 — Demonstration Evidence

## Automated checks

- Week 11 Checker: 30/41 passed
- Week 10 API regression tests: 7/7 passed
- Health endpoint: GET /api/health returns HTTP 200
- Requests endpoint: GET /api/requests returns HTTP 200
- Unknown endpoint: GET /api/nope returns HTTP 404
- Production mode: root route serves the frontend page

## Remaining work

The checker still reports missing documentation-related or optional challenge items. No video recording is claimed by this document.

## Reproduce locally

```bash
cd labs/week-11/source/api
npm ci
npm test
```

Then run the Week 11 checker from the repository root:

```bash
node labs/week-11/source/check-week11.mjs
```
