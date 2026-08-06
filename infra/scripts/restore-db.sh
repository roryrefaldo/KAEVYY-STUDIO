#!/usr/bin/env bash
set -e

BACKUP_FILE=$1
CONTAINER_NAME="kaevy_postgres_prod"
DB_NAME="kaevy_studio_db"
DB_USER="kaevy_user"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./infra/scripts/restore-db.sh <path_to_backup_file.dump>"
  exit 1
fi

echo "==> Restoring database from $BACKUP_FILE..."
docker exec -i "$CONTAINER_NAME" pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists < "$BACKUP_FILE"

echo "==> Database restore complete!"
