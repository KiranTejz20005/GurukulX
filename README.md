# GurukulX 🚀

> **GurukulX** is a modern, enterprise-grade, multi-tenant Learning Management System (LMS) and Learning Platform engineered as a high-performance **Turborepo monorepo**. Built with **Next.js 16**, **React 19**, **NestJS 11**, **Prisma ORM**, and integrated with **Reticle Proof Layer** for automated agentic quality assurance.

---

## 📑 Table of Contents

- [Features](#-features)
- [Monorepo Architecture](#-monorepo-architecture)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Initialization](#database-initialization)
- [Development Commands](#-development-commands)
- [Self-Deployment Guide](#-self-deployment-guide)
  - [Architecture & Requirements](#architecture--requirements)
  - [Production Environment Setup](#production-environment-setup)
  - [Option 1: Docker & Docker Compose (Recommended)](#option-1-docker--docker-compose-recommended)
  - [Option 2: Bare-Metal / VPS Deployment (PM2 + Nginx)](#option-2-bare-metal--vps-deployment-pm2--nginx)
  - [Reverse Proxy & SSL Configuration](#reverse-proxy--ssl-configuration)
  - [Cloud Storage Setup (Cloudflare R2 / AWS S3)](#cloud-storage-setup-cloudflare-r2--aws-s3)
  - [Updating & Maintenance](#updating--maintenance)
- [In-App Verification (Reticle)](#-in-app-verification-reticle)
- [Database Schema & Data Model](#-database-schema--data-model)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏢 Multi-Tenant Workspaces

- **Custom Branding & Domains**: Workspace-level customization with custom domain routing and custom JSON branding themes.
- **Role-Based Access Control (RBAC)**: Support for workspace roles (`ADMIN`, `INSTRUCTOR`, `STUDENT`) via `WorkspaceMember`.
- **API Key & Integration Layer**: Generate and manage workspace API keys for external integrations.

### 📚 Course & Curriculum Management

- **Hierarchical Course Builder**: Organize content cleanly into **Courses**, **Modules**, and **Lessons**.
- **Interactive Drag & Drop**: Module and lesson ordering using `@hello-pangea/dnd`.
- **Rich Lesson Types**: Support for Rich Text content, Cloudflare R2 video streaming, Quizzes, and Assignments.

### ✍️ Assessment & Evaluation System

- **Interactive Quizzes**: Auto-graded quizzes with configurable passing scores (`passingScore`) and attempt tracking.
- **Assignment Submissions**: Submission portal for student assignments with instructor grading capabilities.
- **Progress Tracking**: Real-time completion tracking per user per lesson (`Progress` model).

### 👥 Community & Learning Pathways

- **Discussion Forums**: Integrated Q&A and forum posts per workspace to drive student engagement.
- **Learning Programs**: Group related courses into structured multi-course certification tracks.
- **Media & Resource Library**: Centralized asset management for images, video attachments, and downloadable files.

---

## 🏗 Monorepo Architecture

GurukulX is structured as a Turborepo monorepo containing distinct applications and shared packages:

```
GurukulX/
├── apps/
│   ├── api/             # NestJS 11 Backend API Service
│   └── web/             # Next.js 16 (App Router) Frontend Web Application
└── packages/
    ├── database/        # Prisma Schema, Client & DB Utilities
    ├── ui/              # Shared UI Component Library & Design System
    ├── types/           # Shared TypeScript Interfaces & Types
    ├── eslint-config/   # Shared ESLint Configuration Rules
    └── typescript-config/# Base TypeScript Configuration Files
```

---

## 🛠 Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 16 (App Router + Turbopack) & React 19
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer
- **UI Primitives**: Radix UI (`@radix-ui/react-dialog`, `select`, `tooltip`, `collapsible`, etc.)
- **Animations & Drag-and-Drop**: Framer Motion, `@hello-pangea/dnd`
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend (`apps/api`)

- **Framework**: NestJS 11 (Express platform)
- **Language**: TypeScript 5.7+
- **Validation**: `class-validator` & `class-transformer`
- **Reactive Extensions**: RxJS
- **Testing**: Jest & Supertest

### Database & Shared Packages (`packages/*`)

- **ORM**: Prisma ORM 5.22
- **Database Driver**: SQLite (Dev) / PostgreSQL compatible
- **Monorepo Engine**: Turborepo v2.9+
- **Verification Layer**: Reticle Proof Layer (`@reticlehq/react`, `@reticlehq/next`)

---

## 🚀 Getting Started

### Prerequisites

Ensure your system meets the following requirements:

- **Node.js**: `>= 18.0.0` (v20+ recommended)
- **Package Manager**: `npm >= 11.0.0` (or `pnpm` / `yarn`)

### Installation

Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/your-org/GurukulX.git
cd GurukulX
npm install
```

### Environment Setup

Copy the example environment files for the workspace applications:

```bash
# Copy root env
cp .env.example .env

# Copy app env files
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Configure your local environment variables in `apps/web/.env` and `apps/api/.env` as needed.

### Database Initialization

Generate the Prisma client and push the schema to your local database:

```bash
# Generate Prisma Client
npm run --workspace=@repo/database build

# Push database schema (SQLite dev.db)
cd packages/database
npx prisma db push
```

---

## 💻 Development Commands

Start all frontend and backend services concurrently using Turborepo:

```bash
# Start all dev servers (Frontend at http://localhost:3000, Backend API watching)
npm run dev
```

To run individual workspaces directly:

```bash
# Run only the Frontend web app
npm run dev --workspace=web

# Run only the Backend API app
npm run dev --workspace=api
```

### Additional Scripts

| Command               | Description                                                 |
| :-------------------- | :---------------------------------------------------------- |
| `npm run dev`         | Runs dev servers for all apps in parallel (`turbo run dev`) |
| `npm run build`       | Builds all packages and applications for production         |
| `npm run lint`        | Runs ESLint across all packages and apps                    |
| `npm run check-types` | Executes TypeScript type checking (`tsc --noEmit`)          |
| `npm run format`      | Formats all TS, TSX, and Markdown files using Prettier      |

---

## 🌐 Self-Deployment Guide

This guide details how to self-host and deploy **GurukulX** in production environments, either using **Docker & Docker Compose** (recommended) or directly on a **Linux VPS / Bare-Metal** with **PM2** and **Nginx**.

### Architecture & Requirements

| Service          | Technology                   | Port              | Role                                         |
| :--------------- | :--------------------------- | :---------------- | :------------------------------------------- |
| **Web Frontend** | Next.js 16 (App Router)      | `3000`            | UI, Student/Admin Dashboards, Public Portals |
| **API Backend**  | NestJS 11                    | `3005`            | REST API, Business Logic, Auth, File Uploads |
| **Database**     | Prisma (SQLite / PostgreSQL) | Internal / `5432` | Data Layer & Persistence                     |

#### Minimum Server Specifications

- **CPU**: 2 vCPUs or higher
- **RAM**: 4 GB RAM minimum (Next.js builds require adequate build-time memory)
- **Disk**: 20 GB SSD storage
- **OS**: Ubuntu 22.04 LTS / Debian 12 / Any modern Linux distribution with Docker support

---

### Production Environment Setup

Create your production environment configuration before launching services.

1. **Root `.env` Configuration**:

```bash
cp .env.example .env
```

Ensure key production secrets are securely generated:

```bash
# Generate high-entropy secrets for JWT and NextAuth
openssl rand -base64 32
```

Configure `.env`:

```env
NODE_ENV=production
PORT=3005

# Frontend public API target
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# Or if using single-domain path routing:
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Database connection
DATABASE_URL="file:/app/packages/database/prisma/dev.db"
# Or for PostgreSQL:
# DATABASE_URL="postgresql://gurukul:strongpassword@postgres:5432/gurukulx?schema=public"

# Authentication Secrets
NEXTAUTH_SECRET="your_generated_random_secret"
NEXTAUTH_URL="https://yourdomain.com"
JWT_SECRET="your_generated_jwt_secret"

# Cloud Storage (Cloudflare R2 / AWS S3)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key_id"
R2_SECRET_ACCESS_KEY="your_secret_access_key"
R2_BUCKET_NAME="gurukulx-media"
NEXT_PUBLIC_R2_PUBLIC_URL="https://media.yourdomain.com"

# SMTP Email (Optional - for invitations & notifications)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT=587
SMTP_USER="smtp_user"
SMTP_PASS="smtp_password"
SMTP_FROM_EMAIL="support@yourdomain.com"
SMTP_FROM_NAME="GurukulX"
```

2. **Sync App Env Files**:

```bash
cp .env apps/api/.env
cp .env apps/web/.env
```

---

### Option 1: Docker & Docker Compose (Recommended)

GurukulX provides an optimized multi-stage [Dockerfile](./Dockerfile) and [docker-compose.yml](./docker-compose.yml).

#### 1. Clone and Prepare

```bash
git clone https://github.com/your-org/GurukulX.git
cd GurukulX
cp .env.example .env
# Edit .env with your production credentials
```

#### 2. Launch Containers

Build and run the frontend and backend in detached mode:

```bash
docker compose up -d --build
```

#### 3. Initialize the Database

Initialize the Prisma database schema inside the API container:

```bash
docker compose exec api npx prisma db push --schema=packages/database/prisma/schema.prisma
```

#### 4. Verify Logs & Status

```bash
# Check running containers
docker compose ps

# View live application logs
docker compose logs -f
```

---

### Option 2: Bare-Metal / VPS Deployment (PM2 + Nginx)

For self-hosting directly on an Ubuntu/Debian VPS without Docker:

#### 1. Install System Dependencies

```bash
# Install Node.js 20 LTS & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential

# Install PM2 process manager globally
sudo npm install -g pm2
```

#### 2. Clone Repository & Install Dependencies

```bash
git clone https://github.com/your-org/GurukulX.git /var/www/gurukulx
cd /var/www/gurukulx

# Install monorepo dependencies
npm ci
```

#### 3. Configure Production Environment

```bash
cp .env.example .env
cp .env apps/api/.env
cp .env apps/web/.env
# Edit .env with your production configuration
nano .env
```

#### 4. Build Monorepo & Initialize Database

```bash
# Push Prisma database schema
cd packages/database
npx prisma generate
npx prisma db push
cd ../..

# Build all applications (NestJS API & Next.js Web)
npm run build
```

#### 5. Launch with PM2 Process Manager

```bash
# Start Backend API
pm2 start apps/api/dist/main.js --name "gurukulx-api"

# Start Frontend Web App
pm2 start npm --name "gurukulx-web" -- run start --workspace=web

# Persist PM2 processes across server reboots
pm2 save
pm2 startup
```

---

### Reverse Proxy & SSL Configuration

Use **Nginx** as a reverse proxy to handle SSL termination and route traffic to the Web (`:3000`) and API (`:3005`) processes.

#### Nginx Configuration (Subdomain Routing)

Create `/etc/nginx/sites-available/gurukulx.conf`:

```nginx
# Web Frontend (yourdomain.com)
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Backend (api.yourdomain.com)
server {
    server_name api.yourdomain.com;

    # Allow larger media and video uploads
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and provision free Let's Encrypt SSL certificates:

```bash
sudo ln -s /etc/nginx/sites-available/gurukulx.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install Certbot & issue SSL
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

### Cloud Storage Setup (Cloudflare R2 / AWS S3)

For storing and streaming course videos, assignments, and media attachments:

1. **Create an S3 or Cloudflare R2 Bucket**: e.g., `gurukulx-media`.
2. **Configure CORS**: Ensure your bucket allows requests from your domain:
   ```json
   [
     {
       "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
3. **Public Access / Custom Domain**: Connect a custom domain (e.g., `media.yourdomain.com`) or enable public bucket access and set `NEXT_PUBLIC_R2_PUBLIC_URL`.

---

### Updating & Maintenance

#### Updating Docker Deployment

```bash
git pull origin main
docker compose up -d --build
docker compose exec api npx prisma db push --schema=packages/database/prisma/schema.prisma
```

#### Updating PM2 Deployment

```bash
cd /var/www/gurukulx
git pull origin main
npm ci
cd packages/database && npx prisma db push && cd ../..
npm run build
pm2 reload all
```

#### Database Backups

- **SQLite**: Backup the `dev.db` database file:
  ```bash
  sqlite3 packages/database/prisma/dev.db ".backup /var/backups/gurukulx_$(date +%F).db"
  ```
- **PostgreSQL**:
  ```bash
  pg_dump -U gurukul gurukulx > /var/backups/gurukulx_$(date +%F).sql
  ```

---

## 🛡 In-App Verification (Reticle)

GurukulX is integrated with **[Reticle](https://reticle.sh)** — an in-app dev SDK and proof layer for AI agents and automated verification.

### Key Capabilities

- **Runtime Proof**: Drives the live Next.js application headlessly to inspect real network requests, store states, console logs, and DOM element attributes.
- **Verification Command**: Run `/reticle` or `npx @reticlehq/server status` to inspect daemon status on bridge port `4400`.
- **Saved Skill**: Reusable Reticle rules and capabilities scaffold are defined in [.agents/skills/reticle/SKILL.md](./.agents/skills/reticle/SKILL.md) and [AGENTS.md](./AGENTS.md).

---

## 📊 Database Schema & Data Model

The database schema defined in `packages/database/prisma/schema.prisma` models a complete educational ecosystem:

```mermaid
erDiagram
    User ||--o{ WorkspaceMember : belongs_to
    Workspace ||--o{ WorkspaceMember : has
    Workspace ||--o{ Course : hosts
    User ||--o{ Course : instructs
    Course ||--o{ Module : contains
    Module ||--o{ Lesson : contains
    Lesson ||--o{ Progress : tracks
    Lesson ||--o| Quiz : has
    Lesson ||--o| Assignment : has
    User ||--o{ Enrollment : enrolls
    Course ||--o{ Enrollment : accepts
    Workspace ||--o{ Forum : contains
    Forum ||--o{ ForumPost : includes
    User ||--o{ ForumPost : authors
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Ensure code standards: `npm run lint` and `npm run check-types`
3. Verify user-facing flows using Reticle verification before submitting PRs.
4. Commit your changes and push to your branch.

---

## 📜 License

This project is licensed under the **UNLICENSED** / Proprietary license. All rights reserved.
