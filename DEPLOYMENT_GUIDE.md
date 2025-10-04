# Guidix Frontend Production Deployment Guide

Complete guide to deploy the Guidix frontend application.

## URLs

- **Frontend URL**: https://app.guidix.ai
- **Backend API URL**: https://api.guidix.ai
- **Ports**: 80 (HTTP), 443 (HTTPS)

## Prerequisites

1. **Server Requirements**
   - Ubuntu 20.04+ / Debian 11+ / CentOS 8+
   - Minimum 2GB RAM
   - 20GB disk space
   - Root or sudo access

2. **Domain Setup**
   - DNS A record: `app.guidix.ai` → Your Server IP
   - DNS A record: `api.guidix.ai` → Backend Server IP

3. **Software**
   - Docker (20.10+)
   - Docker Compose (2.0+)

## Step-by-Step Deployment

### 1. Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Add current user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clone or Upload Project

```bash
# Option A: Clone from Git
git clone https://github.com/your-org/guidix-frontend.git
cd guidix-frontend

# Option B: Upload via SCP
# On your local machine:
scp -r /path/to/project user@server-ip:/home/user/guidix-frontend
```

### 3. Set Up SSL Certificates

#### Option A: Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot -y

# Obtain certificate (ensure ports 80/443 are not in use)
sudo certbot certonly --standalone \
  -d app.guidix.ai \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Create ssl directory in project
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/app.guidix.ai/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/app.guidix.ai/privkey.pem ./ssl/

# Set permissions
sudo chown $USER:$USER ./ssl/*.pem
chmod 644 ./ssl/fullchain.pem
chmod 600 ./ssl/privkey.pem
```

#### Option B: Cloudflare Origin Certificate

```bash
# Create ssl directory
mkdir -p ssl

# Create certificate file
nano ssl/fullchain.pem
# Paste your Cloudflare certificate and save

# Create private key file
nano ssl/privkey.pem
# Paste your private key and save

# Set permissions
chmod 644 ssl/fullchain.pem
chmod 600 ssl/privkey.pem
```

### 4. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH (if not already allowed)

# Enable firewall (if not enabled)
sudo ufw enable

# Check status
sudo ufw status
```

### 5. Build and Deploy

```bash
# Navigate to project directory
cd /path/to/guidix-frontend

# Build and start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check running containers
docker ps
```

### 6. Verify Deployment

```bash
# Test HTTP redirect to HTTPS
curl -I http://app.guidix.ai

# Test HTTPS
curl -I https://app.guidix.ai

# Check SSL certificate
openssl s_client -connect app.guidix.ai:443 -servername app.guidix.ai

# Test health endpoint
curl https://app.guidix.ai/health
```

### 7. Set Up Auto-Renewal for SSL (Let's Encrypt only)

```bash
# Test renewal
sudo certbot renew --dry-run

# Create renewal script
sudo nano /usr/local/bin/renew-ssl.sh

# Add this content:
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/app.guidix.ai/*.pem /path/to/guidix-frontend/ssl/
cd /path/to/guidix-frontend
docker-compose restart nginx

# Make executable
sudo chmod +x /usr/local/bin/renew-ssl.sh

# Add to crontab
sudo crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * /usr/local/bin/renew-ssl.sh
```

## Production Checklist

- [ ] DNS records configured (app.guidix.ai → Server IP)
- [ ] SSL certificates installed and valid
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Docker & Docker Compose installed
- [ ] Application deployed via docker-compose
- [ ] HTTPS working (HTTP redirects to HTTPS)
- [ ] Backend API accessible at api.guidix.ai
- [ ] SSL auto-renewal configured (if using Let's Encrypt)
- [ ] Monitoring set up (optional)
- [ ] Backup strategy in place (optional)

## Useful Commands

### Service Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f
docker-compose logs -f nginx
docker-compose logs -f guidix-frontend

# Rebuild and restart
docker-compose up -d --build --force-recreate
```

### Monitoring

```bash
# Check container status
docker ps

# Check resource usage
docker stats

# View specific container logs
docker logs guidix-nginx
docker logs guidix-frontend

# Execute shell in container
docker exec -it guidix-frontend sh
docker exec -it guidix-nginx sh
```

### Troubleshooting

```bash
# Check if ports are open
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Check nginx configuration
docker exec guidix-nginx nginx -t

# Restart specific service
docker-compose restart nginx
docker-compose restart guidix-frontend

# View all containers (including stopped)
docker ps -a

# Remove all containers and rebuild
docker-compose down
docker-compose up -d --build
```

## Updating the Application

```bash
# Pull latest code (if using Git)
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or without downtime
docker-compose up -d --build --force-recreate --no-deps guidix-frontend
```

## Rollback

```bash
# Stop current version
docker-compose down

# Checkout previous version (if using Git)
git checkout <previous-commit-hash>

# Rebuild and start
docker-compose up -d --build
```

## Environment Variables

All production environment variables are embedded in the Docker image:

```
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
NEXT_PUBLIC_RESUME_API_URL=https://api.guidix.ai
NEXT_PUBLIC_AUTO_APPLY_API_URL=https://api.guidix.ai
NEXT_PUBLIC_JOB_SERVICE_URL=https://api.guidix.ai
NEXT_PUBLIC_RESUME_SERVICE_URL=https://api.guidix.ai
```

No need to set them manually!

## Security Best Practices

1. ✅ Use HTTPS only (automatic redirect from HTTP)
2. ✅ Keep SSL certificates valid and auto-renewed
3. ✅ Run containers as non-root user (configured)
4. ✅ Use firewall to restrict access
5. ✅ Regularly update Docker images
6. ✅ Monitor container logs
7. ✅ Enable HSTS headers (configured in nginx)
8. ✅ Implement rate limiting (optional)

## Performance Optimization

The deployment is already optimized with:
- Next.js standalone output (minimal image size)
- Nginx reverse proxy with gzip compression
- Static file caching
- HTTP/2 support
- Image optimization

## Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify SSL certificates: `ls -la ssl/`
3. Test nginx config: `docker exec guidix-nginx nginx -t`
4. Check DNS resolution: `nslookup app.guidix.ai`
5. Test connectivity: `curl -v https://app.guidix.ai`

## Quick Production Deployment (TL;DR)

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sudo sh

# 2. Install Certbot and get SSL
sudo apt install certbot -y
sudo certbot certonly --standalone -d app.guidix.ai --email your@email.com --agree-tos

# 3. Prepare project
mkdir -p ssl
sudo cp /etc/letsencrypt/live/app.guidix.ai/*.pem ./ssl/
sudo chown $USER:$USER ./ssl/*.pem

# 4. Deploy
docker-compose up -d --build

# 5. Verify
curl -I https://app.guidix.ai

# Done! Your app is live at https://app.guidix.ai
```

## Architecture Overview

```
┌─────────────────────────────────────┐
│     Internet (app.guidix.ai)        │
└──────────────┬──────────────────────┘
               │
          Ports 80, 443
               │
┌──────────────▼──────────────────────┐
│      Nginx (SSL Termination)        │
│   - HTTP → HTTPS redirect           │
│   - SSL/TLS handling                │
│   - Reverse proxy                   │
└──────────────┬──────────────────────┘
               │
          Port 3000 (internal)
               │
┌──────────────▼──────────────────────┐
│    Next.js Application              │
│   - Server-side rendering           │
│   - API route handling              │
│   - Static file serving             │
└──────────────┬──────────────────────┘
               │
          HTTPS requests
               │
┌──────────────▼──────────────────────┐
│    Backend API (api.guidix.ai)      │
│   - REST API endpoints              │
│   - Authentication                  │
│   - Database operations             │
└─────────────────────────────────────┘
```
