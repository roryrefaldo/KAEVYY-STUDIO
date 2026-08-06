# KAEVY STUDIO — Infrastructure & DevOps Directory Structure

Welcome to the KAEVY STUDIO Enterprise Infrastructure hub (`/infra`). This directory organizes all DevOps, containerization, cloud deployment, monitoring, and orchestration configurations.

## Folder Organization

```
/infra
├── docker/              # Dockerfiles (dev & prod) and Docker Compose configurations
├── cloudrun/            # Google Cloud Run deployment manifests & automation scripts
├── github/              # GitHub Actions workflows & CI/CD templates
├── monitoring/          # Prometheus, Grafana, Loki, and Alertmanager configurations
├── postgres/            # Enterprise PostgreSQL production configurations (postgresql.conf, pg_hba.conf)
├── redis/               # Redis cache & Socket.IO broker configuration (redis.conf)
├── storage/             # Object storage policies for Google Cloud Storage and AWS S3
├── terraform/           # Terraform IaC templates for GCP / AWS infrastructure provisioning
├── scripts/             # Infrastructure management and deployment utility scripts
└── README.md            # This documentation index
```

## Quick Reference

- **Development Docker Stack**: `docker-compose -f infra/docker/docker-compose.dev.yml up`
- **Production Docker Stack**: `docker-compose -f infra/docker/docker-compose.prod.yml up -d`
- **Cloud Run Deploy**: `./infra/cloudrun/deploy.sh`
- **Database Backup**: `./scripts/backup-db.sh`
- **Database Migration**: `./scripts/migrate.sh`
