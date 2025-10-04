# SSL Certificate Setup for app.guidix.ai

This guide explains how to set up SSL certificates for the Guidix frontend application.

## Production Deployment URLs

- **Frontend**: https://app.guidix.ai (ports 80/443)
- **Backend API**: https://api.guidix.ai

## Option 1: Using Let's Encrypt (Recommended - Free)

### Step 1: Install Certbot

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install certbot

# On CentOS/RHEL
sudo yum install certbot
```

### Step 2: Obtain SSL Certificate

```bash
# Stop nginx if running
docker-compose down

# Obtain certificate
sudo certbot certonly --standalone \
  -d app.guidix.ai \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Certificates will be saved to:
# /etc/letsencrypt/live/app.guidix.ai/fullchain.pem
# /etc/letsencrypt/live/app.guidix.ai/privkey.pem
```

### Step 3: Copy Certificates to Project

```bash
# Create ssl directory
mkdir -p ssl

# Copy certificates (requires sudo)
sudo cp /etc/letsencrypt/live/app.guidix.ai/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/app.guidix.ai/privkey.pem ./ssl/

# Set permissions
sudo chown $USER:$USER ./ssl/*.pem
chmod 644 ./ssl/fullchain.pem
chmod 600 ./ssl/privkey.pem
```

### Step 4: Start Services

```bash
docker-compose up -d
```

### Step 5: Set Up Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e

# Add this line (runs daily at 2 AM):
0 2 * * * certbot renew --quiet && cp /etc/letsencrypt/live/app.guidix.ai/*.pem /path/to/project/ssl/ && docker-compose restart nginx
```

## Option 2: Using Certbot with Docker Compose

### Step 1: Uncomment Certbot Service

Edit `docker-compose.yml` and uncomment the certbot service.

### Step 2: Initial Certificate Setup

```bash
# Create ssl directory
mkdir -p ssl

# Run certbot in standalone mode (one-time)
docker run -it --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/certbot-webroot:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d app.guidix.ai \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Copy certificates to expected location
cp ssl/live/app.guidix.ai/fullchain.pem ssl/
cp ssl/live/app.guidix.ai/privkey.pem ssl/
```

### Step 3: Start Services

```bash
docker-compose up -d
```

Certificates will auto-renew via the certbot container.

## Option 3: Using Custom SSL Certificates

If you have SSL certificates from a provider (e.g., Cloudflare, DigiCert):

### Step 1: Place Certificates

```bash
# Create ssl directory
mkdir -p ssl

# Copy your certificates
cp /path/to/your/fullchain.pem ./ssl/fullchain.pem
cp /path/to/your/privkey.pem ./ssl/privkey.pem

# Set permissions
chmod 644 ./ssl/fullchain.pem
chmod 600 ./ssl/privkey.pem
```

### Step 2: Start Services

```bash
docker-compose up -d
```

## Option 4: Using Cloudflare (Easiest)

If your domain uses Cloudflare:

### Step 1: Enable Full SSL/TLS

1. Go to Cloudflare Dashboard → SSL/TLS
2. Set encryption mode to "Full" or "Full (strict)"
3. Enable "Always Use HTTPS"

### Step 2: Generate Origin Certificate

1. Go to SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Save certificate and private key

### Step 3: Add to Project

```bash
# Create ssl directory
mkdir -p ssl

# Save Cloudflare origin certificate
cat > ssl/fullchain.pem << 'EOF'
-----BEGIN CERTIFICATE-----
[Paste your certificate here]
-----END CERTIFICATE-----
EOF

# Save private key
cat > ssl/privkey.pem << 'EOF'
-----BEGIN PRIVATE KEY-----
[Paste your private key here]
-----END PRIVATE KEY-----
EOF

# Set permissions
chmod 644 ssl/fullchain.pem
chmod 600 ssl/privkey.pem
```

### Step 4: Start Services

```bash
docker-compose up -d
```

## Verify SSL Setup

### Test HTTPS Connection

```bash
# Test SSL certificate
curl -v https://app.guidix.ai

# Check certificate details
openssl s_client -connect app.guidix.ai:443 -servername app.guidix.ai
```

### Online SSL Checkers

- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

## Troubleshooting

### Certificate Not Found

```bash
# Check if certificates exist
ls -la ssl/

# Ensure proper permissions
chmod 644 ssl/fullchain.pem
chmod 600 ssl/privkey.pem

# Restart nginx
docker-compose restart nginx
```

### Certificate Expired

```bash
# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/app.guidix.ai/*.pem ./ssl/

# Restart nginx
docker-compose restart nginx
```

### Mixed Content Warnings

Ensure all API calls use HTTPS:
- Frontend: https://app.guidix.ai
- Backend: https://api.guidix.ai

### Port Already in Use

```bash
# Check what's using port 80/443
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Stop conflicting services
sudo systemctl stop apache2  # or nginx
```

## DNS Configuration

Ensure your DNS records point to your server:

```
A Record: app.guidix.ai → Your-Server-IP
```

Wait for DNS propagation (can take up to 48 hours).

## Security Best Practices

1. ✅ Use HTTPS only (HTTP redirects to HTTPS)
2. ✅ Enable HSTS headers
3. ✅ Use modern TLS protocols (TLS 1.2, 1.3)
4. ✅ Set secure cipher suites
5. ✅ Regular certificate renewal
6. ✅ Keep nginx updated

## Quick Start (Production Deployment)

```bash
# 1. Obtain SSL certificate (Let's Encrypt)
sudo certbot certonly --standalone -d app.guidix.ai --email your-email@example.com --agree-tos

# 2. Copy certificates
mkdir -p ssl
sudo cp /etc/letsencrypt/live/app.guidix.ai/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/app.guidix.ai/privkey.pem ./ssl/
sudo chown $USER:$USER ./ssl/*.pem

# 3. Build and deploy
docker-compose up -d

# 4. Verify
curl -v https://app.guidix.ai

# 5. Set up auto-renewal
sudo crontab -e
# Add: 0 2 * * * certbot renew --quiet && cp /etc/letsencrypt/live/app.guidix.ai/*.pem /path/to/ssl/ && docker-compose restart nginx
```

Your application is now running at:
- **Frontend**: https://app.guidix.ai (ports 80, 443)
- **Backend API**: https://api.guidix.ai
