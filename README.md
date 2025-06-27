# TCIT Posts Backend

[![Build Status](https://img.shields.io/github/actions/workflow/status/Alejandrehl/tcit-posts-backend/ci.yml?branch=main&label=build)](https://github.com/Alejandrehl/tcit-posts-backend/actions)
[![Coverage](https://img.shields.io/badge/coverage-99%25-brightgreen)](https://github.com/Alejandrehl/tcit-posts-backend/actions)
[![Docker Image Size](https://img.shields.io/docker/image-size/library/node/20-slim?label=docker%20image)](https://hub.docker.com/_/node)

Technical Challenge for TCIT - Senior Full Stack React/Node.js Engineer

A robust REST API for managing blog posts built with NestJS, TypeScript, and PostgreSQL.

---

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Health Check](#health-check)
- [Docker Workflow](#docker-workflow)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Architecture](#architecture)
- [NPM Scripts](#npm-scripts)
- [Database Migrations](#database-migrations)
- [CI/CD](#cicd)
- [FAQ](#faq)
- [License](#license)
- [Author & Contact](#author--contact)

---

## Features
- **REST API** for managing Posts (CRUD operations)
- **Modern Stack**: Node.js 20, NestJS 11+, Fastify, TypeORM 0.3, PostgreSQL 14+
- **Type Safety**: Strict TypeScript with comprehensive type definitions
- **Security**: Global CORS, Helmet, rate limiting, input validation
- **Documentation**: OpenAPI 3.1 docs with Swagger UI at `/docs`
- **Health Check**: `/health` endpoint for monitoring and health checks
- **Testing**: 98% test coverage with unit and e2e tests
- **CI/CD**: GitHub Actions with automated testing
- **Docker**: Multi-stage Dockerfile optimized for production
- **API Versioning**: RESTful endpoints with `/v1` prefix
- **Database**: PostgreSQL with TypeORM migrations

---

## Quick Start

### Prerequisites
- **Node.js** 20.x ([Download here](https://nodejs.org/en/download))
- **npm** (comes with Node.js)
- **PostgreSQL** 14+ ([Install for Mac](https://postgresapp.com/), [Linux](https://www.postgresql.org/download/linux/), [Windows](https://www.postgresql.org/download/windows/))
- **Git**

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alejandrehl/tcit-posts-backend.git
   cd tcit-posts-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy the example file and edit it with your local credentials:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and make sure to fill in all values, especially `DATABASE_USER` and `DATABASE_PASSWORD`.

4. **Create the PostgreSQL user and database**
   If you do not have a user or database, you can create them as follows (adjust user and password to match your .env):
   ```bash
   # Access the PostgreSQL console
   psql -U postgres
   # Inside psql:
   CREATE USER postgres WITH PASSWORD 'your_password_here';
   CREATE DATABASE tcit_posts OWNER postgres;
   \q
   ```
   If you use a different user, update your .env accordingly.

5. **Run database migrations**
   ```bash
   npm run migration:run
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

7. **Verify the installation**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/docs
   - Health check: http://localhost:3000/health
   - Posts: http://localhost:3000/v1/posts

### Docker Setup (Alternative)

1. **Make sure you have Docker and Docker Compose installed**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Start the services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - PostgreSQL: localhost:5432

4. **Stop the containers**
   ```bash
   docker-compose down
   ```

> **Note:** If port 3000 or 5432 is already in use, stop the process using it or change the port in `.env` and in `docker-compose.yml`.

---

## Troubleshooting (Common Issues)

- **Database connection error**: Make sure PostgreSQL is running and the credentials in `.env` are correct.
- **Port 3000 already in use**: Stop the process using it (`lsof -i :3000` and then `kill <PID>`), or change the port in `.env`.
- **`psql` command not found**: Make sure PostgreSQL is installed and the binary is in your PATH.
- **Dependency issues**: Run `npm ci` to reinstall from scratch.
- **Tests fail due to files in dist**: Run `find dist -name 'test-setup.*' -delete` and re-run the tests.

---

## Local Development

### Development Workflow

- **Start development server**
  ```bash
  npm run start:dev
  ```
  The server will restart automatically on file changes.

- **Run tests**
  ```bash
  npm test
  npm run test:cov
  npm run test:watch
  ```

- **Lint and format**
  ```bash
  npm run lint
  npm run format
  ```

- **Database operations**
  ```bash
  npm run migration:run
  npm run migration:generate -- src/migrations/NewMigration
  ```

### API Testing

- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health
- **Curl examples**:
  ```bash
  # Create a post
  curl -X POST http://localhost:3000/v1/posts \
    -H "Content-Type: application/json" \
    -d '{"name": "My First Post", "description": "Post content"}'

  # List all posts
  curl http://localhost:3000/v1/posts

  # Delete a post
  curl -X DELETE http://localhost:3000/v1/posts/1

  # Health check
  curl http://localhost:3000/health
  ```

---

## Health Check

- **Endpoint**: `GET /health`
- **Purpose**: Used for Docker and monitoring
- **Response Example**:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-06-27T19:42:19.382Z",
    "uptime": 45.152403271,
    "database": {
      "status": "connected",
      "responseTime": 12
    },
    "memory": {
      "used": 39.31,
      "total": 40.87,
      "percentage": 96.18
    }
  }
  ```
- **Error Example**:
  ```json
  {
    "status": "error",
    "timestamp": "2025-06-27T19:42:19.382Z",
    "uptime": 45.152403271,
    "database": {
      "status": "disconnected",
      "error": "Connection timeout"
    },
    "memory": {
      "used": 39.31,
      "total": 40.87,
      "percentage": 96.18
    }
  }
  ```

---

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3000` | No |
| `DATABASE_HOST` | PostgreSQL host | `localhost` | Yes |
| `DATABASE_PORT` | PostgreSQL port | `5432` | No |
| `DATABASE_USER` | Database username | - | Yes |
| `DATABASE_PASSWORD` | Database password | - | Yes |
| `DATABASE_NAME` | Database name | `tcit_posts` | No |

---

## API Documentation

### Base URL
- **Local**: http://localhost:3000

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/v1/posts` | List all posts |
| `POST` | `/v1/posts` | Create a new post |
| `DELETE` | `/v1/posts/:id` | Delete a post by ID |

### Interactive Documentation
- **Swagger UI**: `/docs`
- **OpenAPI JSON**: `/docs-json`

### Example Requests

**Create Post**
```bash
curl -X POST /v1/posts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Blog Post",
    "description": "This is the content of my blog post"
  }'
```

**List Posts**
```bash
curl GET /v1/posts
```

**Delete Post**
```bash
curl -X DELETE /v1/posts/1
```

---

## Testing

### Test Coverage
- **Current Coverage**: 98%
- **Target Coverage**: 80% (configurable)
- **Test Types**: Unit tests, Integration tests, E2E tests

### Running Tests
```bash
# All tests
npm test

# With coverage report
npm run test:cov

# Watch mode
npm run test:watch

# E2E tests only
npm run test:e2e
```

### Test Structure
```
src/
├── posts/
│   ├── __tests__/
│   │   ├── posts.controller.spec.ts
│   │   ├── posts.service.spec.ts
│   │   ├── posts.repository.spec.ts
│   │   └── posts.e2e-spec.ts
│   └── ...
└── ...
```

---

## Architecture

```
src/
├── main.ts                 # Application bootstrap
├── app.module.ts          # Root module
├── config/                # Configuration module
│   ├── config.module.ts
│   ├── typeorm.config.ts
│   └── validation.schema.ts
├── posts/                 # Posts feature module
│   ├── post.entity.ts     # Database entity
│   ├── posts.controller.ts # REST endpoints
│   ├── posts.service.ts   # Business logic
│   ├── posts.repository.ts # Data access
│   ├── posts.module.ts    # Module definition
│   ├── dto/               # Data Transfer Objects
│   │   ├── create-post.dto.ts
│   │   └── list-posts.dto.ts
│   └── __tests__/         # Tests
└── migrations/            # Database migrations
```

### Design Patterns
- **SOLID Principles**: Clean architecture implementation
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Input/output validation
- **Dependency Injection**: NestJS IoC container

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run start:dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to dist/ |
| `npm test` | Run all tests |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run migration:run` | Run database migrations |
| `npm run migration:generate` | Generate new migration |

---

## Database Migrations

### Commands
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Migration Files
- Located in `/migrations/`
- Written in TypeScript
- Automatically run on application startup

---

## CI/CD

### GitHub Actions
- **Trigger**: Push to main branch or Pull Request
- **Workflow**: `.github/workflows/ci.yml`
- **Steps**:
  1. Lint code
  2. Run tests with coverage
  3. Build application

### Quality Gates
- Code must pass linting
- Tests must pass with 80%+ coverage
- Build must succeed

---

## FAQ

**Q: How do I reset the database?**
A: For local development, drop and recreate the database. For Docker: `docker-compose down -v && docker-compose up -d`

**Q: How do I add a new API endpoint?**
A: Create the controller method, add corresponding service method, and update tests.

**Q: How do I update the database schema?**
A: Modify the entity, generate a migration: `npm run migration:generate`, then run it: `npm run migration:run`

**Q: How do I access the API documentation?**
A: Visit `/docs` endpoint when the server is running.

---

## License

This project is for technical evaluation purposes only.

---

## Author & Contact

**Alejandro Exequiel Hernández Lara**

- **Phone:** +56 9 4488 9280
- **Email:** [alejandrehl@icloud.com](mailto:alejandrehl@icloud.com)
- **LinkedIn:** [linkedin.com/in/alejandrehl](https://www.linkedin.com/in/alejandrehl/)
- **GitHub:** [github.com/Alejandrehl](https://github.com/Alejandrehl)

---