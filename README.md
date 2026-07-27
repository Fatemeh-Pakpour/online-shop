# Task Manager — Full-Stack Starter

A minimal, production-shaped task manager built as a pnpm workspaces monorepo.

## 1. Architecture

```
root/
├── apps/
│   ├── api/                     NestJS 11 · Apollo Server 5 · Mongoose 9
│   │   └── src/
│   │       ├── config/          Joi environment validation
│   │       ├── common/pipes/    ObjectId validation pipe
│   │       ├── tasks/
│   │       │   ├── dto/         GraphQL inputs + class-validator rules
│   │       │   ├── models/      GraphQL object types
│   │       │   ├── schemas/     Mongoose schema
│   │       │   ├── tasks.resolver.ts
│   │       │   ├── tasks.service.ts
│   │       │   └── tasks.module.ts
│   │       ├── app.module.ts
│   │       └── main.ts
│   └── web/                     React 19 · Vite 8 · Apollo Client 4
│       └── src/
│           ├── apollo/          Client, links, error handling
│           ├── components/      Presentational components
│           ├── features/tasks/  Task page + data hook
│           └── graphql/         Typed operations
├── pnpm-workspace.yaml
└── tsconfig.base.json           Strict TypeScript shared by both apps
```

Request flow: **React → Apollo Client → `/graphql` → NestJS resolver → service → Mongoose model → MongoDB Atlas.**

The API is GraphQL-only (code-first): TypeScript decorators generate the schema at
`apps/api/src/schema.gql` on startup. Mongoose documents are mapped to GraphQL models in
the service layer, so persistence details never reach the API surface.

## 2. Requirements

- Node.js >= 20
- pnpm >= 10 (`corepack enable pnpm`)
- A MongoDB Atlas account (free M0 tier is enough)

## 3. Installation

```bash
pnpm install
```

## 4. MongoDB Atlas configuration

1. Create a free **M0 cluster** at <https://cloud.mongodb.com>.
2. **Database Access → Add New Database User.** Choose password authentication and note the
   username and password.
   > This database user password is **not** your MongoDB Atlas account/login password. It is a
   > separate credential that only exists inside the cluster.
3. **Network Access → Add IP Address.** Add your current developer IP (or `0.0.0.0/0` for local
   experimentation only — never in production).
4. **Database → Connect → Drivers → Node.js.** Copy the connection string, which looks like
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`.
5. Replace `<username>` and `<password>` with the database user you created, and add the database
   name (`task_manager`) before the query string. URL-encode any special characters in the password.
6. Put the result in `apps/api/.env` as `MONGODB_URI`.

## 5. Environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

`apps/api/.env`

| Variable       | Description                            | Default                 |
| -------------- | -------------------------------------- | ----------------------- |
| `PORT`         | API port                               | `3000`                  |
| `MONGODB_URI`  | Atlas connection string (**required**) | —                       |
| `FRONTEND_URL` | Allowed CORS origin                    | `http://localhost:5173` |
| `NODE_ENV`     | `development` / `production` / `test`  | `development`           |

`apps/web/.env`

| Variable           | Description          | Default                         |
| ------------------ | -------------------- | ------------------------------- |
| `VITE_GRAPHQL_URL` | API GraphQL endpoint | `http://localhost:3000/graphql` |

Environment variables are validated with Joi at boot — the API refuses to start with a missing or
malformed `MONGODB_URI`. `.env` files are gitignored; never commit real credentials.

## 6. Development commands

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Runs API and web together             |
| `pnpm dev:api`   | API only, watch mode (port 3000)      |
| `pnpm dev:web`   | Web only, Vite dev server (port 5173) |
| `pnpm build`     | Builds both apps                      |
| `pnpm test`      | Runs unit tests                       |
| `pnpm lint`      | ESLint across the workspace           |
| `pnpm typecheck` | TypeScript check without emitting     |
| `pnpm format`    | Prettier write                        |

## 7. GraphQL endpoint

- Endpoint: <http://localhost:3000/graphql>
- Apollo Sandbox (development only) is served at the same URL in a browser.
- Introspection is disabled when `NODE_ENV=production`.

## 8. Example operations

Query all tasks:

```graphql
query Tasks {
  tasks {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```

Create a task:

```graphql
mutation CreateTask {
  createTask(input: { title: "Ship the MVP" }) {
    id
    title
    completed
  }
}
```

Toggle and delete:

```graphql
mutation ToggleTask($id: ID!) {
  toggleTask(id: $id) {
    id
    completed
  }
}

mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}
```

Full API surface:

| Operation                                      | Returns    |
| ---------------------------------------------- | ---------- |
| `tasks`                                        | `[Task!]!` |
| `task(id: ID!)`                                | `Task`     |
| `createTask(input: CreateTaskInput!)`          | `Task!`    |
| `updateTask(id: ID!, input: UpdateTaskInput!)` | `Task!`    |
| `deleteTask(id: ID!)`                          | `Boolean!` |
| `toggleTask(id: ID!)`                          | `Task!`    |

Titles are trimmed and must be 1–200 characters. Invalid ObjectIds return a `BAD_USER_INPUT`
error; missing tasks return a "not found" error.

## 9. Production considerations

- Build with `pnpm build`, then run the API with `node apps/api/dist/main.js` behind a process
  manager; serve `apps/web/dist` from a CDN or static host.
- Set `NODE_ENV=production` — this disables introspection and the Apollo Sandbox landing page and
  enables the strict Helmet CSP.
- Set `FRONTEND_URL` to the deployed web origin; CORS allows exactly that origin.
- Restrict Atlas Network Access to your server's egress IPs and give the database user the minimum
  role required.
- Inject secrets through your platform's secret manager, not `.env` files.
- Add depth/complexity limiting and rate limiting before exposing the API publicly.
- Add an index on the fields you sort or filter by as the collection grows (`createdAt` is used for
  the default ordering).
# online-shop
