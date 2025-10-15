# Docker Deployment Guide

## Production URLs

- **Frontend**: https://app.guidix.ai
- **Backend API**: https://api.guidix.ai

## Deployment Options

This project supports multiple deployment methods:

1. **Google Cloud Run** (Recommended) - See `CLOUD_RUN_DEPLOYMENT.md`

   - ✅ Automatic SSL/HTTPS
   - ✅ Auto-scaling
   - ✅ Pay-per-use
   - ✅ Zero infrastructure management

2. **Docker Compose** (Self-hosted) - This guide
   - Requires manual SSL setup
   - Full control over infrastructure

## Quick Start (Cloud Run)

```bash
# See CLOUD_RUN_DEPLOYMENT.md for complete guide
gcloud run deploy guidix-frontend --image gcr.io/PROJECT_ID/guidix-frontend:latest
```

## Local Development with Docker

### Prerequisites

1. **Docker & Docker Compose** installed

### Build and Run with Docker Compose

```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

**Note**: This runs on port 8080 (Cloud Run compatible). For production with custom domains, use Cloud Run (see `CLOUD_RUN_DEPLOYMENT.md`).

### Manual Docker Build

```bash
# Build the Docker image
docker build -t guidix-frontend:latest .

# Run the container
docker run -d -p 8080:8080 --name guidix-frontend guidix-frontend:latest

# Access at http://localhost:8080
```

## Environment Variables

The Docker image is pre-configured with production API URLs:

- `NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai`
- `NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai`
- `NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai`
- `NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai`
- `NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai`

These are embedded at **build time** and stored in the Docker image.

## Deployment Commands

### Development

```bash
# Local development uses .env.local (api.guidix.ai)
npm run dev
```

### Production

```bash
# Build Docker image with production URLs
docker build -t guidix-frontend:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --name guidix-frontend \
  --restart unless-stopped \
  guidix-frontend:latest

# Check logs
docker logs -f guidix-frontend
```

### Push to Registry

```bash
# Tag image
docker tag guidix-frontend:latest your-registry.com/guidix-frontend:latest

# Push to registry
docker push your-registry.com/guidix-frontend:latest
```

## Architecture

### Google Cloud Run (Production)

```
Internet
    ↓
Cloud Run Load Balancer (automatic HTTPS)
    ↓
Next.js Application (port 8080)
    ↓
Backend API (api.guidix.ai)
```

### Local Development

```
localhost:8080
    ↓
Next.js Application (Docker)
    ↓
Backend API (api.guidix.ai)
```

## Access the Application

- **Production (Cloud Run)**: https://app.guidix.ai
- **Local Docker**: http://localhost:8080
- **Local Development**: http://localhost:3000 (npm run dev)

## Common Commands

```bash
# View running containers
docker ps

# Stop container
docker stop guidix-frontend

# Start container
docker start guidix-frontend

# Remove container
docker rm guidix-frontend

# Remove image
docker rmi guidix-frontend:latest

# View logs
docker logs guidix-frontend
docker logs -f guidix-frontend  # Follow logs

# Execute shell in container
docker exec -it guidix-frontend sh
```

## Troubleshooting

### Check container health

```bash
docker ps
docker logs guidix-frontend
```

### Port already in use

```bash
# Use different port
docker run -d -p 3001:3000 --name guidix-frontend guidix-frontend:latest
```

### Rebuild without cache

```bash
docker build --no-cache -t guidix-frontend:latest .
```

## Image Details

- **Base**: Node.js 20 Alpine (minimal size)
- **Output**: Standalone (optimized for production)
- **Size**: ~150-250 MB
- **User**: Non-root (nextjs:1001)
- **Port**: 3000
