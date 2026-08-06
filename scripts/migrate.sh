#!/usr/bin/env bash
set -e

echo "==> Executing Drizzle schema migration..."
npm run db:push || npx drizzle-kit push
echo "==> Schema migration executed successfully!"
