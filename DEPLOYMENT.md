# KAEVY STUDIO — Production Deployment Guide
**Supported Environments: Railway, Render, Google Cloud Run, Docker VPS (Ubuntu)**

---

## 1. Prerequisites

- Docker 24.0+ and Docker Compose v2+
- Node.js 20.x+ (for local CLI administration)
- PostgreSQL 16 instance (or Docker container)
- Redis 7 instance

---

## 2. Option A: Docker Compose VPS Deployment (Recommended)

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/kaevystudio/app.git
cd app
cp .env.example .env
nano .env
```

Ensure `JWT_SECRET`, `POSTGRES_PASSWORD`, and `REDIS_PASSWORD` are updated with strong production secrets.

### Step 2: Launch Stack
```bash
docker-compose up -d --build
```

### Step 3: Verify Container Health
```bash
docker-compose ps
curl -I http://localhost/health
```

---

## 3. Option B: Google Cloud Run Deployment

### Step 1: Build & Push Container Image
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/kaevy-studio:latest
```

### Step 2: Deploy Service
```bash
gcloud run deploy kaevy-studio \
  --image gcr.io/YOUR_PROJECT_ID/kaevy-studio:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production,DATABASE_URL="postgres://user:pass@host/db"
```

---

## 4. Option C: Railway / Render Deployment

1. Connect GitHub repository to Railway or Render dashboard.
2. Select **Dockerfile** build method.
3. Add PostgreSQL and Redis plugins.
4. Set Environment Variables from `.env.example`.
5. Deploy service. Railway/Render automatically handles SSL termination and domain binding.
