# =========================================================
# KAEVY STUDIO - Production Multi-Stage Dockerfile
# Phase 10: Production Deployment & DevOps
# =========================================================

# Stage 1: Build Frontend & Backend Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools & dependencies
COPY package.json package-lock.json* bun.lock* ./
RUN npm ci --include=dev || npm install

# Copy source code
COPY . .

# Build Vite SPA assets & esbuild server
RUN npm run build

# Stage 2: Production Runtime Execution
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Create non-root system user and group for security hardening
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 kaevy -G nodejs

# Copy built application output from Stage 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.example ./.env.example

# Set directory permissions for non-root runtime
RUN chown -R kaevy:nodejs /app

USER kaevy

EXPOSE 3000

# Healthcheck probe for container readiness
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "dist/server.cjs"]
