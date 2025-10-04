# Docker Deployment Guide for Guidix Frontend

This guide explains how to build and deploy the Guidix frontend application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose (optional, for easier deployment)
- At least 2GB of free disk space

## Environment Configuration

The Docker container is pre-configured with **production API URLs** pointing to `https://api.guidix.com`. These environment variables are baked into the Docker image during build time.

### Production Environment Variables (Built into Docker)

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.com
NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.com
NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.com
NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.com
NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.com
```

## Building the Docker Image

### Option 1: Using Docker directly

```bash
# Navigate to the project directory
cd "D:\CareerGuide\Guidix Beta\frontend\resume-builder-v2\resume-builder-v2"

# Build the Docker image
docker build -t guidix-frontend:latest .

# Run the container
docker run -d \
  --name guidix-frontend \
  -p 3000:3000 \
  --restart unless-stopped \
  guidix-frontend:latest
```

### Option 2: Using Docker Compose (Recommended)

```bash
# Navigate to the project directory
cd "D:\CareerGuide\Guidix Beta\frontend\resume-builder-v2\resume-builder-v2"

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Accessing the Application

Once the container is running, access the application at:
- **Local**: http://localhost:3000
- **Production**: https://your-domain.com (configure your reverse proxy)

## Docker Commands Cheat Sheet

### Build and Run

```bash
# Build the image
docker build -t guidix-frontend:latest .

# Run the container
docker run -d -p 3000:3000 --name guidix-frontend guidix-frontend:latest

# Using Docker Compose
docker-compose up -d
```

### Management

```bash
# View running containers
docker ps

# View logs
docker logs guidix-frontend
docker logs -f guidix-frontend  # Follow logs

# Stop the container
docker stop guidix-frontend

# Start the container
docker start guidix-frontend

# Restart the container
docker restart guidix-frontend

# Remove the container
docker rm guidix-frontend

# Remove the image
docker rmi guidix-frontend:latest
```

### Debugging

```bash
# Execute shell inside container
docker exec -it guidix-frontend sh

# View container stats
docker stats guidix-frontend

# Inspect container
docker inspect guidix-frontend
```

## Production Deployment

### 1. Build for Production

```bash
docker build -t guidix-frontend:v1.0.0 .
```

### 2. Tag for Registry (Optional)

```bash
# Tag for Docker Hub
docker tag guidix-frontend:v1.0.0 yourusername/guidix-frontend:v1.0.0

# Push to Docker Hub
docker push yourusername/guidix-frontend:v1.0.0

# Or tag for private registry
docker tag guidix-frontend:v1.0.0 registry.yourdomain.com/guidix-frontend:v1.0.0
docker push registry.yourdomain.com/guidix-frontend:v1.0.0
```

### 3. Deploy with Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Override (If Needed)

If you need to override the API URL at runtime (not recommended, as NEXT_PUBLIC_ vars are embedded at build time):

```bash
docker run -d \
  --name guidix-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://different-api.com \
  guidix-frontend:latest
```

**Note**: This will only affect server-side API calls. Client-side calls use the build-time embedded values.

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs guidix-frontend

# Check container status
docker ps -a
```

### Port already in use

```bash
# Use a different port
docker run -d -p 3001:3000 --name guidix-frontend guidix-frontend:latest
```

### Build fails

```bash
# Clear Docker cache and rebuild
docker build --no-cache -t guidix-frontend:latest .
```

### Out of disk space

```bash
# Remove unused images
docker image prune -a

# Remove unused containers
docker container prune

# Remove everything unused
docker system prune -a
```

## Health Check

The container includes a health check that monitors the application status:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' guidix-frontend
```

## Multi-Environment Deployment

### Development with Different API

For development with local backend:

```dockerfile
# Create Dockerfile.dev
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:8000
CMD ["npm", "run", "dev"]
```

```bash
docker build -f Dockerfile.dev -t guidix-frontend:dev .
docker run -d -p 3000:3000 guidix-frontend:dev
```

## Performance Optimization

The Docker image is optimized with:
- Multi-stage builds (reduced image size)
- Standalone output (minimal runtime dependencies)
- Non-root user (security)
- Layer caching (faster rebuilds)
- Production build with minification

Expected image size: ~150-250 MB (much smaller than typical Node.js apps)

## Security Notes

1. The container runs as a non-root user (nextjs)
2. Only necessary files are copied (see .dockerignore)
3. Environment variables are set at build time
4. No sensitive data in the image
5. HTTPS should be handled by reverse proxy

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Docker image
        run: docker build -t guidix-frontend:latest .

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push guidix-frontend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull guidix-frontend:latest
            docker-compose up -d
```

## Support

For issues or questions:
1. Check logs: `docker logs guidix-frontend`
2. Verify environment variables: `docker exec guidix-frontend env`
3. Test API connectivity from container: `docker exec guidix-frontend wget -O- https://api.guidix.com`
