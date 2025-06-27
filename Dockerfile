# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/src/ && test -f dist/src/main.js

# Stage 2: Production
FROM node:20-slim
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations

# Verify files are copied correctly
RUN ls -la dist/src/ && test -f dist/src/main.js

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

EXPOSE 3000

# Health check with longer timeout and interval
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start command with delay to allow database to be ready
CMD ["sh", "-c", "sleep 10 && node dist/src/main.js"] 