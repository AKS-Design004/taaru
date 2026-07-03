#!/bin/bash
set -e

echo "=== TAARU Deployment Setup ==="

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }

# Create directories
mkdir -p /opt/taaru/nginx/ssl
mkdir -p /opt/taaru/nginx/ssl-data
mkdir -p /opt/taaru/backups/{db,files}
mkdir -p /opt/taaru/scripts

# Copy files
cp docker-compose.prod.yml /opt/taaru/docker-compose.yml
cp nginx/taaru.conf /opt/taaru/nginx/taaru.conf
cp scripts/backup-db.sh /opt/taaru/scripts/
cp scripts/backup-files.sh /opt/taaru/scripts/
chmod +x /opt/taaru/scripts/*.sh

# Environment
if [ ! -f /opt/taaru/.env ]; then
    cp .env.production.example /opt/taaru/.env
    echo "Edit /opt/taaru/.env with your secrets"
fi

# Initial SSL (self-signed for setup, then certbot)
if [ ! -f /opt/taaru/nginx/ssl/live/taaru.sn/fullchain.pem ]; then
    echo "Run: docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d taaru.sn -d www.taaru.sn"
fi

echo "=== Setup complete ==="
echo "Next: docker compose up -d"
