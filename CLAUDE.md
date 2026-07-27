# Project instructions

## Stack

pnpm workspaces monorepo — `apps/api` (NestJS + Apollo + Mongoose) and `apps/web` (React + Vite + Apollo Client).

## Rules

- Use **pnpm** only. Never `npm` or `yarn`. Install into a workspace with `pnpm --filter @app/api add <pkg>`.
- Preserve the monorepo structure: shared code goes in `packages/*`, never cross-import between apps.
- The API is **GraphQL only**. Do not add REST controllers.
- Keep resolvers thin — they wire arguments to a service and nothing else.
- All database logic lives in services. Mongoose types must never leak into GraphQL models.
- Validate every external input with `class-validator` DTOs and the `ParseObjectIdPipe` for ids.
- Never commit secrets. `.env` is gitignored; only `.env.example` is tracked.
- Do not inspect `node_modules`, `dist`, `build`, `coverage`, or `apps/api/src/schema.gql` (generated).
- Do not add dependencies without a concrete need.
- Run targeted tests first (`pnpm --filter @app/api test -- tasks.service`) before the full suite.
- Keep responses concise; do not print whole files back after editing them.

## Commands

| Task           | Command                           |
| -------------- | --------------------------------- |
| Dev (both)     | `pnpm dev`                        |
| Typecheck      | `pnpm typecheck`                  |
| Lint           | `pnpm lint`                       |
| Test           | `pnpm test`                       |
| Build          | `pnpm build`                      |
| Single package | `pnpm --filter @app/api <script>` |

## Gotchas

- `graphql` must stay on `^16` — Apollo Server 5 and `@nestjs/graphql` 13 do not accept v17.
- The GraphQL schema is code-first and written to `apps/api/src/schema.gql` on startup.
- The API refuses to boot without a valid `MONGODB_URI` (Joi validation).
