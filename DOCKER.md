# KAEVY STUDIO — Docker & Container Management Guide

---

## 1. Multi-Stage Dockerfile Architecture

The production `Dockerfile` utilizes a 2-stage build strategy:

- **Stage 1 (`builder`)**: Installs full npm devDependencies, builds Vite SPA client bundles, and compiles server TypeScript into `dist/server.cjs` using `esbuild`.
- **Stage 2 (`runner`)**: Uses clean `node:20-alpine`, creates a non-root user `kaevy` (UID 1001), copies only runtime `dist/` and `node_modules/`, resulting in a lightweight, secure container image (~120 MB).

---

## 2. Common Docker Commands

### Build Local Container Image
```bash
docker build -t kaevystudio/app:latest .
```

### Run Container Standalone
```bash
docker run -d \
  --name kaevy_app \
  -p 3000:3000 \
  --env-file .env \
  kaevystudio/app:latest
```

### Inspect Container Health Probes
```bash
docker inspect --format='{{json .State.Health}}' kaevy_app | jq
```

### Stream Live Container Logs
```bash
docker logs -f kaevy_app
```

### Execute Shell inside Container
```bash
docker exec -it kaevy_app /bin/sh
```
