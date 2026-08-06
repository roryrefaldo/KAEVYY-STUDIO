#!/usr/bin/env bash
set -e

echo "==> Deploying KAEVY STUDIO Production Stack..."
docker-compose -f infra/docker/docker-compose.prod.yml up -d --build
echo "==> Production stack launched successfully. Access at http://localhost"
