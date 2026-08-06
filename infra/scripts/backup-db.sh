#!/usr/bin/env bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
CONTAINER_NAME="kaevy_postgres_prod"
DB_NAME="kaevy_studio_db"
DB_USER="kaevy_user"

mkdir -p "$BACKUP_DIR"

echo "==> Executing PostgreSQL backup..."
docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -F c "$DB_NAME" > "$BACKUP_DIR/db_backup_$TIMESTAMP.dump"

echo "==> Backup created at $BACKUP_DIR/db_backup_$TIMESTAMP.dump"
