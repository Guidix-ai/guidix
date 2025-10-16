# Cloud Run Environment Variables Setup - Summary

## ✅ What Was Changed

### 1. Dockerfile Updates

#### Build Stage - Build Arguments

```dockerfile
# Build arguments (passed from Cloud Build)
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
```

#### Runtime Stage - Runtime Variables

```dockerfile
# Runtime environment variables for Cloud Run
ENV API_BASE_URL=https://api.guidix.ai
ENV RESUME_API_URL=https://api.guidix.ai
ENV AUTO_APPLY_API_URL=https://api.guidix.ai
ENV JOB_SERVICE_URL=https://api.guidix.ai
ENV RESUME_SERVICE_URL=https://api.guidix.ai
```

### 2. Cloud Build Configuration (cloudbuild.yaml)

#### Docker Build with Build Arguments

```yaml
- name: "gcr.io/cloud-builders/docker"
  args:
    - "build"
    - "--build-arg"
    - "NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai"
    - "--build-arg"
    - "NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai"
    - "--build-arg"
    - "NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai"
    - "--build-arg"
    - "NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai"
    - "--build-arg"
    - "NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai"
    - "-t"
    - "gcr.io/$PROJECT_ID/guidix-frontend:$SHORT_SHA"
```

#### Cloud Run Deployment with Runtime Variables

```yaml
- "--set-env-vars"
- "API_BASE_URL=https://api.guidix.ai,RESUME_API_URL=https://api.guidix.ai,AUTO_APPLY_API_URL=https://api.guidix.ai,JOB_SERVICE_URL=https://api.guidix.ai,RESUME_SERVICE_URL=https://api.guidix.ai,NODE_ENV=production"
```

### 3. Server-Side API Routes Updated

All API routes now use runtime environment variables:

**app/api/v1/auth/signin/route.js**

```javascript
const API_BASE_URL = process.env.API_BASE_URL || "https://api.guidix.ai";
```

**app/api/v1/auth/logout/route.js**

```javascript
const API_BASE_URL = process.env.API_BASE_URL || "https://api.guidix.ai";
```

**app/api/v1/auth/refresh/route.js**

```javascript
const API_BASE_URL = process.env.API_BASE_URL || "https://api.guidix.ai";
```

---

## How It Works

### Development (localhost)

```
Client-side: NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai (from .env.local)
Server-side: Falls back to https://api.guidix.ai
```

### Production (Cloud Run)

```
BUILD TIME:
- Cloud Build passes --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
- Next.js embeds this in client-side JavaScript bundles

RUNTIME:
- Cloud Run sets ENV: API_BASE_URL=https://api.guidix.ai
- Server-side API routes read from process.env.API_BASE_URL
- These can be updated without rebuild
```

---

## Deployment Commands

### Local Docker Build

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai \
  --build-arg NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai \
  --build-arg NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai \
  --build-arg NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai \
  --build-arg NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai \
  -t guidix-frontend .
```

### Local Docker Run

```bash
docker run -p 8080:8080 \
  -e API_BASE_URL=https://api.guidix.ai \
  -e RESUME_API_URL=https://api.guidix.ai \
  -e AUTO_APPLY_API_URL=https://api.guidix.ai \
  -e JOB_SERVICE_URL=https://api.guidix.ai \
  -e RESUME_SERVICE_URL=https://api.guidix.ai \
  -e NODE_ENV=production \
  guidix-frontend
```

### Cloud Build & Deploy

```bash
# Automatic deployment via Cloud Build
gcloud builds submit --config=cloudbuild.yaml
```

### Manual Cloud Run Deploy

```bash
gcloud run deploy guidix-frontend \
  --image gcr.io/PROJECT_ID/guidix-frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars API_BASE_URL=https://api.guidix.ai,RESUME_API_URL=https://api.guidix.ai,AUTO_APPLY_API_URL=https://api.guidix.ai,JOB_SERVICE_URL=https://api.guidix.ai,RESUME_SERVICE_URL=https://api.guidix.ai,NODE_ENV=production
```

---

## Environment Variables Summary

### Build-Time Variables (Client-Side)

✅ Embedded in JavaScript bundles during `npm run build`
✅ Visible in browser (public)
✅ Require rebuild to change

- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_RESUME_API_URL
- NEXT_PUBLIC_AUTO_APPLY_API_URL
- NEXT_PUBLIC_JOB_SERVICE_URL
- NEXT_PUBLIC_RESUME_SERVICE_URL

### Runtime Variables (Server-Side)

✅ Available at container runtime
✅ NOT visible in browser (secure)
✅ Can be updated without rebuild

- API_BASE_URL
- RESUME_API_URL
- AUTO_APPLY_API_URL
- JOB_SERVICE_URL
- RESUME_SERVICE_URL
- NODE_ENV
- PORT (set by Cloud Run to 8080)

---

## URL Configuration

### Development

- Frontend: http://localhost:3000
- Backend API: https://api.guidix.ai

### Production

- Frontend: https://app.guidix.ai (Cloud Run)
- Backend API: https://api.guidix.ai

---

## Key Benefits

✅ **Separation of Concerns**

- Client-side: Uses NEXT*PUBLIC*\* (build-time)
- Server-side: Uses regular ENV (runtime)

✅ **Flexibility**

- Server-side URLs can change without rebuild
- Just update Cloud Run environment variables

✅ **Security**

- Server-side ENV vars not exposed to browser
- Client-side vars are public (no secrets)

✅ **Cloud Run Compatible**

- Uses ARG for build-time configuration
- Uses ENV for runtime configuration
- Follows Cloud Run best practices

---

## Files Changed

1. ✅ `Dockerfile` - Added ARG and ENV for both build and runtime
2. ✅ `cloudbuild.yaml` - Added --build-arg and --set-env-vars
3. ✅ `app/api/v1/auth/signin/route.js` - Uses process.env.API_BASE_URL
4. ✅ `app/api/v1/auth/logout/route.js` - Uses process.env.API_BASE_URL
5. ✅ `app/api/v1/auth/refresh/route.js` - Uses process.env.API_BASE_URL
6. ✅ `ENVIRONMENT_VARIABLES.md` - Complete documentation created
7. ✅ `CLOUD_RUN_ENV_SETUP.md` - This summary document

---

## Testing

### Test Build Locally

```bash
npm run build
```

### Test Docker Build

```bash
docker build -t guidix-test .
```

### Test Docker Run

```bash
docker run -p 8080:8080 guidix-test
# Visit http://localhost:8080
```

### Test with Production URLs

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai \
  -t guidix-prod .

docker run -p 8080:8080 \
  -e API_BASE_URL=https://api.guidix.ai \
  guidix-prod
```

---

## ✅ Setup Complete!

Your frontend is now configured to:

1. Load environment variables from Docker at runtime
2. Work seamlessly with Cloud Run
3. Support both development and production environments
4. Keep server-side variables secure (not visible in browser)
