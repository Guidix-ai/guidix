# Multi-stage Dockerfile for Next.js Production Build
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for environment variables (can be passed during docker build)
ARG NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_RESUME_API_URL=$NEXT_PUBLIC_RESUME_API_URL
ENV NEXT_PUBLIC_AUTO_APPLY_API_URL=$NEXT_PUBLIC_AUTO_APPLY_API_URL
ENV NEXT_PUBLIC_JOB_SERVICE_URL=$NEXT_PUBLIC_JOB_SERVICE_URL
ENV NEXT_PUBLIC_RESUME_SERVICE_URL=$NEXT_PUBLIC_RESUME_SERVICE_URL

# Build the application
RUN npm run build

# Production runtime image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime environment variables for Cloud Run
# These can be overridden by Cloud Run environment variables
ENV API_BASE_URL=https://api.guidix.ai
ENV RESUME_API_URL=https://api.guidix.ai
ENV AUTO_APPLY_API_URL=https://api.guidix.ai
ENV JOB_SERVICE_URL=https://api.guidix.ai
ENV RESUME_SERVICE_URL=https://api.guidix.ai

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public

# Set correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage Next.js standalone output for minimal image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run uses PORT environment variable (default 8080)
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
