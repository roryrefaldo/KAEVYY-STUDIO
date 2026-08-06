# KAEVY STUDIO — DATABASE SEED GUIDE (RC1)

**Version**: 1.0.0 (Release Candidate 1)

---

## 🌱 Overview

The seeding system initializes KAEVY STUDIO with system roles, permissions, default exchange rates, service category taxonomies, demo client accounts, demo developer accounts, sample services, active orders, milestones, escrow holds, asset listings, and notifications.

---

## 🚀 Execution

To seed the target PostgreSQL database or reset seed data:

```bash
npx tsx ./src/db/seed.ts
```

---

## 👥 Pre-Seeded Accounts & Demo Credentials

The seed script creates the following demo accounts:

### 1. Super Admin
- **Email**: `admin@kaevy.studio`
- **Display Name**: `Kaevy System Admin`
- **Role**: `ADMIN`
- **Token**: `kaevy_token_50000000-0000-0000-0000-000000000001`

### 2. Client Account
- **Email**: `client@acmecorp.com`
- **Display Name**: `Acme Corp Client`
- **Role**: `CLIENT`
- **Token**: `kaevy_token_50000000-0000-0000-0000-000000000002`

### 3. Verified Developer
- **Email**: `dev.alex@kaevy.studio`
- **Display Name**: `Alex Rivers (Full-Stack Lead)`
- **Role**: `DEVELOPER`
- **Tier**: `VERIFIED` (Capacity: 3 active projects)
- **Token**: `kaevy_token_50000000-0000-0000-0000-000000000003`

### 4. Elite Developer
- **Email**: `dev.elena@kaevy.studio`
- **Display Name**: `Elena Vance (AI & Cloud Architect)`
- **Role**: `DEVELOPER`
- **Tier**: `ELITE` (Capacity: 5 active projects)
- **Token**: `kaevy_token_50000000-0000-0000-0000-000000000004`

---

## 📊 Pre-Seeded Service Categories

1. **Full-Stack & Web App Development** (`fullstack-web`)
2. **AI & Machine Learning Engineering** (`ai-ml`)
3. **Mobile App Development** (`mobile-dev`)
4. **DevOps & Cloud Infrastructure** (`devops-cloud`)
5. **Blockchain & Smart Contracts** (`blockchain`)
