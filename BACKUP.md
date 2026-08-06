# KAEVY STUDIO — Database Backup, Restore & Disaster Recovery Guide

---

## 1. PostgreSQL Backup Strategy

KAEVY STUDIO implements automated PostgreSQL backups using `pg_dump` with compressed custom format archives.

### Automated Nightly Backup Script (`scripts/backup_db.sh`)
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/kaevy_postgres"
CONTAINER_NAME="kaevy_postgres"
DB_NAME="kaevy_studio_db"
DB_USER="kaevy_user"

mkdir -p $BACKUP_DIR

# Execute pg_dump inside container
docker exec $CONTAINER_NAME pg_dump -U $DB_USER -F c $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.dump

# Delete backups older than 30 days (Retention Policy)
find $BACKUP_DIR -type f -name "*.dump" -mtime +30 -delete

echo "Backup created successfully: $BACKUP_DIR/db_backup_$TIMESTAMP.dump"
```

---

## 2. Database Restoration Procedure

To restore a backup into a fresh or existing database instance:

```bash
# 1. Transfer backup file to server
scp db_backup_20260803.dump user@server:/tmp/

# 2. Execute pg_restore inside container
docker exec -i kaevy_postgres pg_restore -U kaevy_user -d kaevy_studio_db --clean --if-exists /tmp/db_backup_20260803.dump
```

---

## 3. Retention & Offsite Replication

- **Retention Policy**: Daily snapshots retained for 30 days; monthly archives retained for 12 months.
- **Offsite Sync**: Nightly backups automatically pushed to encrypted S3 / GCS bucket via `aws s3 sync` or `gcloud storage cp`.
