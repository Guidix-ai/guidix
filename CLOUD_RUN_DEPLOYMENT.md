# Google Cloud Run Deployment Guide

Complete guide to deploy Guidix Frontend to Google Cloud Run.

## Production URLs

- **Frontend**: https://app.guidix.ai (managed by Cloud Run)
- **Backend API**: https://api.guidix.ai
- **Cloud Run handles**: SSL/TLS, scaling, load balancing

## Why Cloud Run?

- ✅ Automatic HTTPS/SSL (no certificates needed)
- ✅ Auto-scaling (0 to many instances)
- ✅ Pay only for what you use
- ✅ Custom domain mapping
- ✅ Global CDN included
- ✅ Managed infrastructure

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed
3. **Docker** installed locally
4. **Domain ownership** of guidix.ai

## Step-by-Step Deployment

### 1. Install and Configure gcloud CLI

```bash
# Install gcloud CLI
# Visit: https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Login
gcloud auth login

# Set project (create if doesn't exist)
gcloud config set project guidix-production

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Authenticate Docker with Google Container Registry

```bash
gcloud auth configure-docker
```

### 3. Build and Push Docker Image

```bash
# Set your project ID
export PROJECT_ID=guidix-production
export IMAGE_NAME=guidix-frontend
export REGION=us-central1

# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:latest .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest
```

### 4. Deploy to Cloud Run

```bash
# Deploy the service
gcloud run deploy guidix-frontend \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai,NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai,NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai,NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai,NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai,NODE_ENV=production"

# Note the service URL (e.g., https://guidix-frontend-xxxxx-uc.a.run.app)
```

### 5. Map Custom Domain (app.guidix.ai)

#### Option A: Using gcloud CLI

```bash
# Add domain mapping
gcloud run domain-mappings create \
  --service guidix-frontend \
  --domain app.guidix.ai \
  --region $REGION

# Follow the instructions to verify domain ownership
# This will give you DNS records to add
```

#### Option B: Using Cloud Console

1. Go to Cloud Run → Select your service
2. Click "Manage Custom Domains"
3. Click "Add Mapping"
4. Enter: `app.guidix.ai`
5. Verify domain ownership
6. Add DNS records as instructed

### 6. Configure DNS

Add these DNS records to your domain registrar:

```
Type: CNAME
Name: app
Value: ghs.googlehosted.com.
TTL: 3600
```

**Note**: DNS propagation can take up to 24-48 hours.

### 7. Verify Deployment

```bash
# Test the Cloud Run URL
curl -I https://guidix-frontend-xxxxx-uc.a.run.app

# Test custom domain (after DNS propagation)
curl -I https://app.guidix.ai

# Check service status
gcloud run services describe guidix-frontend --region $REGION
```

## Configuration

### Environment Variables

All environment variables are embedded in the Docker image:

```
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai
NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai
NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai
NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai
```

### Resource Limits

Default configuration:
- **Memory**: 512 Mi
- **CPU**: 1 vCPU
- **Min instances**: 0 (scales to zero)
- **Max instances**: 10
- **Timeout**: 300s
- **Port**: 8080

Adjust as needed:

```bash
gcloud run services update guidix-frontend \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 20 \
  --region $REGION
```

## Continuous Deployment (CI/CD)

### Using Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build the Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/guidix-frontend:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/guidix-frontend:latest'
      - '.'

  # Push the Docker image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/guidix-frontend:$SHORT_SHA'

  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/guidix-frontend:latest'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'guidix-frontend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/guidix-frontend:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/guidix-frontend:$SHORT_SHA'
  - 'gcr.io/$PROJECT_ID/guidix-frontend:latest'

options:
  machineType: 'N1_HIGHCPU_8'
```

Connect to GitHub:

```bash
# Link repository
gcloud builds triggers create github \
  --repo-name=guidix-frontend \
  --repo-owner=your-org \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  PROJECT_ID: guidix-production
  SERVICE_NAME: guidix-frontend
  REGION: us-central1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ env.PROJECT_ID }}
          export_default_credentials: true

      - name: Configure Docker
        run: gcloud auth configure-docker

      - name: Build Docker image
        run: |
          docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
                       -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

      - name: Push Docker image
        run: |
          docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA
          docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated
```

## Useful Commands

### View Logs

```bash
# Stream logs
gcloud run services logs tail guidix-frontend --region $REGION

# View in Cloud Console
gcloud run services logs read guidix-frontend --region $REGION --limit 100
```

### Update Service

```bash
# Deploy new version
docker build -t gcr.io/$PROJECT_ID/guidix-frontend:latest .
docker push gcr.io/$PROJECT_ID/guidix-frontend:latest
gcloud run deploy guidix-frontend --image gcr.io/$PROJECT_ID/guidix-frontend:latest --region $REGION

# Update environment variables
gcloud run services update guidix-frontend \
  --update-env-vars "NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai" \
  --region $REGION

# Update memory/CPU
gcloud run services update guidix-frontend \
  --memory 1Gi \
  --cpu 2 \
  --region $REGION
```

### Monitoring

```bash
# Get service details
gcloud run services describe guidix-frontend --region $REGION

# List revisions
gcloud run revisions list --service guidix-frontend --region $REGION

# View metrics in Cloud Console
# Or visit: https://console.cloud.google.com/run
```

### Rollback

```bash
# List revisions
gcloud run revisions list --service guidix-frontend --region $REGION

# Rollback to specific revision
gcloud run services update-traffic guidix-frontend \
  --to-revisions REVISION_NAME=100 \
  --region $REGION
```

### Delete Service

```bash
gcloud run services delete guidix-frontend --region $REGION
```

## Cost Optimization

### Pay-per-use Pricing

- **vCPU**: $0.00002400/vCPU-second
- **Memory**: $0.00000250/GiB-second
- **Requests**: $0.40/million requests
- **Free tier**: 2 million requests/month

### Best Practices

1. **Scale to zero**: Set `min-instances=0` when not in use
2. **Right-size resources**: Start small, scale as needed
3. **Use CDN**: Cloud Run includes global CDN
4. **Optimize images**: Use multi-stage builds (already done)
5. **Monitor usage**: Set up billing alerts

## Security

### IAM and Access Control

```bash
# Make service public (already done with --allow-unauthenticated)
gcloud run services add-iam-policy-binding guidix-frontend \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region $REGION

# Make service private (require authentication)
gcloud run services remove-iam-policy-binding guidix-frontend \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region $REGION
```

### Best Practices

- ✅ Use Cloud Armor for DDoS protection
- ✅ Enable Cloud CDN for performance
- ✅ Use VPC connector if needed for private resources
- ✅ Implement rate limiting at application level
- ✅ Use service accounts with minimal permissions

## Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds log --stream

# Test locally
docker build -t guidix-frontend:test .
docker run -p 8080:8080 guidix-frontend:test
```

### Service Not Accessible

```bash
# Check service status
gcloud run services describe guidix-frontend --region $REGION

# Check logs
gcloud run services logs tail guidix-frontend --region $REGION

# Verify domain mapping
gcloud run domain-mappings describe --domain app.guidix.ai --region $REGION
```

### DNS Issues

```bash
# Check DNS propagation
nslookup app.guidix.ai
dig app.guidix.ai

# Verify CNAME record
dig app.guidix.ai CNAME
```

## Quick Deployment Script

Create `deploy-cloud-run.sh`:

```bash
#!/bin/bash

# Configuration
PROJECT_ID="guidix-production"
SERVICE_NAME="guidix-frontend"
REGION="us-central1"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Guidix Frontend to Cloud Run..."

# Build and push
echo "📦 Building Docker image..."
docker build -t $IMAGE:latest .

echo "⬆️  Pushing to Container Registry..."
docker push $IMAGE:latest

echo "🌐 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🔗 Service URL: https://app.guidix.ai"
```

Make executable and run:

```bash
chmod +x deploy-cloud-run.sh
./deploy-cloud-run.sh
```

## Summary

Google Cloud Run provides:
- 🔒 Automatic HTTPS/SSL
- 📈 Auto-scaling (0 to 1000+ instances)
- 🌍 Global CDN
- 💰 Pay-per-use pricing
- 🚀 Zero infrastructure management
- 🔄 Rolling updates
- 📊 Built-in monitoring

Your app will be live at **https://app.guidix.ai** with enterprise-grade infrastructure!
