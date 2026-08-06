#!/usr/bin/env bash
set -e

echo "==> Starting KAEVY STUDIO Development Stack..."
docker-compose -f infra/docker/docker-compose.dev.yml up --build
