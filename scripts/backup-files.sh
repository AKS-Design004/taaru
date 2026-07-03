#!/bin/bash
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/taaru/backups/files"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

tar czf "$BACKUP_DIR/nginx_ssl_${TIMESTAMP}.tar.gz" -C /opt/taaru nginx/ssl

docker exec taaru-redis redis-cli SAVE
tar czf "$BACKUP_DIR/redis_data_${TIMESTAMP}.tar.gz" -C /var/lib/docker/volumes $(docker volume inspect taaru_redis_data --format '{{.Mountpoint}}' | xargs basename)

find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Files backup completed"
