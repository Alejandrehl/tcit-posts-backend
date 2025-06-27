# TCIT Posts Backend

[![Build Status](https://img.shields.io/github/actions/workflow/status/your-org/your-repo/ci.yml?branch=main&label=build)](../../actions)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](../../actions)
[![Docker Image Size](https://img.shields.io/docker/image-size/library/node/20-slim?label=docker%20image)](https://hub.docker.com/_/node)

Technical Challenge for TCIT - Senior Full Stack React/Node.js Engineer

---

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Docker Workflow](#docker-workflow)
- [Environment Variables](#environment-variables)
- [NPM Scripts](#npm-scripts)
- [Database Migrations](#database-migrations)
- [OpenAPI & SDK](#openapi--sdk)
- [Architecture](#architecture)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Conventional Commits & Release](#conventional-commits--release)
- [Developer Shortcuts (Makefile)](#developer-shortcuts-makefile)
- [FAQ](#faq)
- [License](#license)

---

## Features
- REST API for managing Posts (CRUD)
- Node.js 20, NestJS 11+, Fastify, TypeORM 0.3, PostgreSQL 14+
- Strict TypeScript, SOLID, hexagonal structure
- Global CORS, Helmet, rate limiting, Pino logger
- OpenAPI 3.1 docs at `/docs` (with @nestjs/swagger)
- 100% test coverage enforced (unit + e2e)
- CI/CD with GitHub Actions, Husky, lint-staged
- Multi-stage Dockerfile (<200MB image), docker-compose
- API versioning (`/v1`)
- Optional: pnpm, Makefile, OpenAPI TypeScript SDK

---

## Quick Start

### Local
```sh
cp .env.example .env
make install
make migration-run
make start-dev
```
App runs at http://localhost:3000

### Docker
```sh
make docker-up
```
App runs at http://localhost:3000 (API) and PostgreSQL at port 5432.

---

## Local Development
- Edit `.env` for your DB credentials
- Run `make migration-run` after changing entities
- Use `make test` and `make test-cov` to ensure 100% coverage
- Lint and format with `make lint` and `make format`

---

## Docker Workflow
- `make docker-up` to start app + db
- `make docker-down` to stop and remove containers
- Persistent volume for PostgreSQL data

---

## Environment Variables
See `.env.example` for all options:
```
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgresdbpassword
DATABASE_NAME=tcit_posts
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
```

---

## NPM Scripts
| Script                | Description                                 |
|-----------------------|---------------------------------------------|
| lint                  | Lint code with ESLint (Airbnb base)         |
| format                | Format code with Prettier                   |
| test                  | Run all tests (unit + e2e)                  |
| test:cov              | Run tests with 100% coverage enforced       |
| build                 | Build TypeScript to dist/                   |
| start                 | Start app from dist/                        |
| start:dev             | Start app in watch mode                     |
| migration:run         | Run DB migrations                           |
| migration:generate    | Generate a new migration                    |

---

## Database Migrations
- Generate: `make migration-generate`
- Run: `make migration-run`
- Revert: `make migration-revert`
- Migrations are in `/migrations` and use TypeScript

---

## OpenAPI & SDK
- Swagger UI: http://localhost:3000/docs
- Export OpenAPI JSON: `make openapi-export`
- Generate TypeScript SDK: `npx openapi-typescript docs/openapi.json -o src/sdk.ts`

---

## Architecture
- **src/**: Main source code
  - **main.ts**: Fastify bootstrap, global middleware, OpenAPI
  - **app.module.ts**: Root module
  - **config/**: Config module (Joi validation, TypeORM config)
  - **posts/**: Posts feature (entity, DTOs, controller, service, repo, tests)
- **migrations/**: TypeORM migrations
- **test/**: Global test setup, e2e tests
- **docs/**: OpenAPI JSON, docs
- **.github/workflows/**: CI/CD
- **Makefile**: Developer shortcuts

---

## Testing
- 100% coverage required (lines, branches, functions, statements)
- Unit tests: `src/posts/__tests__/*.spec.ts`
- E2E tests: `src/posts/__tests__/posts.e2e-spec.ts`
- Run: `make test` or `make test-cov`

---

## CI/CD
- GitHub Actions: `.github/workflows/ci.yml`
- Runs lint, test (with coverage), and build on push/PR to main
- Fails if coverage < 100%

---

## Conventional Commits & Release
- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/)
- Optionally use `semantic-release` for automated changelogs

---

## Developer Shortcuts (Makefile)
- See `Makefile` for all commands
- Example: `make migration-generate`, `make docker-up`, `make openapi-export`

---

## FAQ
**Q: How do I reset the database?**
A: `make docker-down` then `make docker-up` (Docker) or drop/recreate DB manually (local).

**Q: How do I ensure 100% coverage?**
A: Run `make test-cov` and add tests until all thresholds are green.

**Q: How do I update the OpenAPI spec?**
A: `make openapi-export` after changing controllers or DTOs.

---

## License
This project is for technical evaluation purposes only.

---

<!--
README generated by AI. Please review and update as needed for your team and workflow.
-->