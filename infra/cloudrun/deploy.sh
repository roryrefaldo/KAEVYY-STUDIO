#!/usr/bin/env bash
set -e

# =========================================================
# KAEVY STUDIO - Google Cloud Run Automated Deployment
# =========================================================

PROJECT_ID=${GCP_PROJECT_ID:-"kaevy-studio-cloud"}
REGION=${GCP_REGION:-"asia-southeast1"}
IMAGE_TAG="gcr.io/${PROJECT_ID}/app:latest"

echo "==> Building container image via Google Cloud Build..."
gcloud builds submit --project "${PROJECT_ID}" --tag "${IMAGE_TAG}" .

echo "==> Deploying service to Cloud Run..."
gcloud run deploy kaevy-studio \
  --project "${PROJECT_ID}" \
  --image "${IMAGE_TAG}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 3000

echo "==> Cloud Run Deployment completed successfully!"
