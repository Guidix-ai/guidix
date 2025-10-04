# Environment Variables Configuration

## Overview
This document explains how environment variables are configured for different environments (development, production, Cloud Run deployment).

---

## Environment Variable Types

### 1. Client-Side Variables (NEXT_PUBLIC_*)
- **Used in**: Browser/client-side code
- **Embedded**: At BUILD time by Next.js
- **Access**: `process.env.NEXT_PUBLIC_*`
- **Security**: Visible in browser, do NOT store secrets

### 2. Server-Side Variables
- **Used in**: Next.js API routes, server components
- **Available**: At RUNTIME
- **Access**: `process.env.*` (without NEXT_PUBLIC prefix)
- **Security**: Not visible in browser, safe for secrets

---

## Development Environment

### Local Development (.env.local)
```bash
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Service-specific URLs (all use same backend)
NEXT_PUBLIC_RESUME_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTO_APPLY_API_URL=http://localhost:8000
NEXT_PUBLIC_JOB_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_RESUME_SERVICE_URL=http://localhost:8000
```

### Usage in Development
```javascript
// Client-side code
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // http://localhost:8000

// Server-side API routes (fallback to client-side for dev)
const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
```

---

## Production Environment (Cloud Run)

### Docker Build Arguments (cloudbuild.yaml)
```yaml
--build-arg NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
--build-arg NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai
--build-arg NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai
--build-arg NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai
--build-arg NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai
```

### Cloud Run Runtime Environment Variables
```yaml
API_BASE_URL=https://api.guidix.ai
RESUME_API_URL=https://api.guidix.ai
AUTO_APPLY_API_URL=https://api.guidix.ai
JOB_SERVICE_URL=https://api.guidix.ai
RESUME_SERVICE_URL=https://api.guidix.ai
NODE_ENV=production
```

### Dockerfile Configuration

#### Build Stage (Build Arguments)
```dockerfile
# Build arguments (passed from Cloud Build)
ARG NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai
ARG NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai

# Set as ENV for Next.js build (embeds in client code)
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_RESUME_API_URL=$NEXT_PUBLIC_RESUME_API_URL
ENV NEXT_PUBLIC_AUTO_APPLY_API_URL=$NEXT_PUBLIC_AUTO_APPLY_API_URL
ENV NEXT_PUBLIC_JOB_SERVICE_URL=$NEXT_PUBLIC_JOB_SERVICE_URL
ENV NEXT_PUBLIC_RESUME_SERVICE_URL=$NEXT_PUBLIC_RESUME_SERVICE_URL
```

#### Runtime Stage (Runtime Variables)
```dockerfile
# Runtime environment variables for server-side API routes
ENV API_BASE_URL=https://api.guidix.ai
ENV RESUME_API_URL=https://api.guidix.ai
ENV AUTO_APPLY_API_URL=https://api.guidix.ai
ENV JOB_SERVICE_URL=https://api.guidix.ai
ENV RESUME_SERVICE_URL=https://api.guidix.ai
```

---

## How It Works

### Build Time (Docker Build)
1. Cloud Build passes `--build-arg NEXT_PUBLIC_*` to Docker
2. Dockerfile converts ARG to ENV
3. Next.js build embeds `NEXT_PUBLIC_*` into client-side JavaScript bundles
4. Client code can access these URLs in the browser

### Runtime (Cloud Run Container)
1. Cloud Run sets environment variables (without NEXT_PUBLIC prefix)
2. Server-side API routes read `process.env.API_BASE_URL`
3. These are NOT visible in browser (secure)
4. Can be updated without rebuilding (just redeploy with new env vars)

---

## Code Usage Patterns

### Client-Side Components
```javascript
// Uses NEXT_PUBLIC_* (embedded at build time)
import { resumeApiClient } from '@/lib/api/resumeClient';

// resumeClient.js
const RESUME_SERVICE_URL = process.env.NEXT_PUBLIC_RESUME_SERVICE_URL || 'http://localhost:8000';
```

### Server-Side API Routes
```javascript
// app/api/v1/auth/signin/route.js
// Uses runtime ENV (without NEXT_PUBLIC prefix)
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export async function POST(request) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

---

## Variable Mapping

### Client-Side (Build Time)
| Variable | Development | Production |
|----------|------------|------------|
| NEXT_PUBLIC_API_BASE_URL | http://localhost:8000 | https://api.guidix.ai |
| NEXT_PUBLIC_RESUME_API_URL | http://localhost:8000 | https://api.guidix.ai |
| NEXT_PUBLIC_AUTO_APPLY_API_URL | http://localhost:8000 | https://api.guidix.ai |
| NEXT_PUBLIC_JOB_SERVICE_URL | http://localhost:8000 | https://api.guidix.ai |

### Server-Side (Runtime)
| Variable | Development | Production |
|----------|------------|------------|
| API_BASE_URL | http://localhost:8000 | https://api.guidix.ai |
| RESUME_API_URL | http://localhost:8000 | https://api.guidix.ai |
| AUTO_APPLY_API_URL | http://localhost:8000 | https://api.guidix.ai |
| JOB_SERVICE_URL | http://localhost:8000 | https://api.guidix.ai |

---

## Files Using Environment Variables

### Server-Side API Routes (Runtime ENV)
- `app/api/v1/auth/signin/route.js` → `API_BASE_URL`
- `app/api/v1/auth/logout/route.js` → `API_BASE_URL`
- `app/api/v1/auth/refresh/route.js` → `API_BASE_URL`

### Client-Side API Clients (Build Time NEXT_PUBLIC_*)
- `lib/api/resumeClient.js` → `NEXT_PUBLIC_RESUME_SERVICE_URL`
- `lib/api/jobClient.js` → `NEXT_PUBLIC_JOB_SERVICE_URL`
- `utils/apiClient.js` → `NEXT_PUBLIC_API_BASE_URL`

---

## Deployment Workflow

### 1. Local Development
```bash
# Create .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Run dev server
npm run dev
```

### 2. Docker Build (Local Testing)
```bash
# Build with custom URLs
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai \
  -t guidix-frontend .

# Run with runtime env vars
docker run -p 8080:8080 \
  -e API_BASE_URL=https://api.guidix.ai \
  guidix-frontend
```

### 3. Cloud Build & Deploy
```bash
# Trigger Cloud Build (uses cloudbuild.yaml)
gcloud builds submit --config=cloudbuild.yaml

# Cloud Build automatically:
# 1. Builds with --build-arg NEXT_PUBLIC_*
# 2. Deploys to Cloud Run with --set-env-vars API_BASE_URL=*
```

### 4. Update Production URLs (Without Rebuild)
```bash
# Update runtime env vars only (server-side)
gcloud run services update guidix-frontend \
  --set-env-vars API_BASE_URL=https://new-api.guidix.ai

# Note: Client-side URLs require rebuild
```

---

## Environment Variable Checklist

### ✅ Build Time (Embedded in Client Code)
- [x] NEXT_PUBLIC_API_BASE_URL
- [x] NEXT_PUBLIC_RESUME_API_URL
- [x] NEXT_PUBLIC_AUTO_APPLY_API_URL
- [x] NEXT_PUBLIC_JOB_SERVICE_URL
- [x] NEXT_PUBLIC_RESUME_SERVICE_URL

### ✅ Runtime (Server-Side Only)
- [x] API_BASE_URL
- [x] RESUME_API_URL
- [x] AUTO_APPLY_API_URL
- [x] JOB_SERVICE_URL
- [x] RESUME_SERVICE_URL
- [x] NODE_ENV
- [x] PORT (Cloud Run sets to 8080)

---

## Troubleshooting

### Issue: Client gets wrong API URL
**Cause**: NEXT_PUBLIC_* not set during build
**Fix**: Pass --build-arg in docker build or set in cloudbuild.yaml

### Issue: Server-side API routes fail
**Cause**: Runtime ENV vars not set in Cloud Run
**Fix**: Use --set-env-vars in gcloud run deploy

### Issue: Changes not reflected
**Cause**: Client-side vars are cached in build
**Fix**: Rebuild Docker image with new --build-arg values

---

## Security Best Practices

✅ **DO:**
- Use NEXT_PUBLIC_* for non-sensitive client data
- Use server-side ENV for API keys, secrets
- Set runtime ENV in Cloud Run for flexibility
- Use --build-arg for public configuration

❌ **DON'T:**
- Put API keys in NEXT_PUBLIC_* (visible in browser)
- Hardcode URLs in code (use ENV)
- Commit .env files to git (use .env.example)
