#!/usr/bin/env bash
set -e

echo "==> Seeding KAEVY STUDIO initial data..."
npm run db:seed || npx tsx src/db/seed.ts
echo "==> Database seed completed successfully!"
