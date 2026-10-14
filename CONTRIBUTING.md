# Contributing

## Branches and pull requests

- Branch from `main` using `feat/…`, `fix/…`, `test/…`, `docs/…` or `chore/…`.
- Keep one concern per pull request; a new table usually lands as
  migration + schema → API → tests → screen.
- Commit messages follow Conventional Commits, scoped by module:
  `feat(sales): GST split on tax invoices`.

## Adding a module

1. Add `server/src/db/migrations/NNN_<table>.sql` (next number).
2. Add `server/src/modules/<table>/schema.js` with fields and a `sample` payload.
3. Add `service.js` (usually `crud(schema)`) and `routes.js` exporting `{ path, router }`.
   Routes are mounted automatically.
4. Add `server/tests/<table>.test.js`; `samplePayload()` builds valid payloads from the schema.
5. Add `client/src/pages/<Name>Page.jsx` exporting `meta`; it appears in the sidebar automatically.

## Checks

```bash
npm --prefix server test
npm --prefix client run build
```
