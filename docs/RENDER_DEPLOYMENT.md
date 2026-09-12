# MissionWell AI — Render Cloud Deployment Guide
*Ministry of Home Affairs / CRPF, Police II Division • Smart India Hackathon*

This guide walks you through deploying **MissionWell AI** to [Render](https://render.com) using **Render Blueprints (Infrastructure as Code)** or **Manual Web Services**.

---

## Architecture on Render

```
                               +-----------------------------------------+
                               |  missionwell-frontend (Render Web Service)
                               |  Next.js 16 • React 19 • Tailwind CSS   |
                               +--------------------+--------------------+
                                                    |
                           Internal / Public REST   |   Session JWT & Auth
                                                    v
                               +-----------------------------------------+
                               |  missionwell-backend (Render Web Service)|
                               |  Node.js Express • Prisma ORM • Jose JWT|
                               +---------+--------------------+----------+
                                         |                    |
                     SQLite / PostgreSQL |                    |  Inference REST
                                         v                    v
                             +-------------------+    +-------------------+
                             |  Database         |    | missionwell-ai-   |
                             |  Prisma SQLite    |    | engine (FastAPI)  |
                             |  or Render PG     |    | LightGBM + SHAP   |
                             +-------------------+    +-------------------+
```

---

## Method 1: 1-Click Render Blueprint (Recommended)

Render Blueprints allow deploying the entire multi-service architecture with a single click using the included [`render.yaml`](../render.yaml).

### Step-by-Step Instructions:

1. **Sign In to Render**:
   * Navigate to [https://dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.

2. **Create New Blueprint**:
   * In the top-right corner, click **"New +"** and select **"Blueprint"**.

3. **Connect Your GitHub Repository**:
   * Select `https://github.com/Pk1823/Codecatalyst.git` (or your fork).
   * Grant Render permission to read the repository.

4. **Review Provisioned Services**:
   Render will parse [`render.yaml`](../render.yaml) and display the 3 services to be created:
   * **`missionwell-ai-engine`**: Python 3.11 FastAPI microservice with LightGBM and SHAP.
   * **`missionwell-backend`**: Node.js Express REST API with Prisma ORM.
   * **`missionwell-frontend`**: Next.js 16 App Router web portal.

5. **Deploy**:
   * Click **"Apply"**.
   * Render will build and deploy all services concurrently with automatic inter-service environment variable linking!

---

## Method 2: Manual Service Creation on Render

If you prefer to configure each service manually in the Render dashboard:

### 1. Deploy the AI Engine Microservice (`missionwell-ai-engine`)
* **Type**: Web Service
* **Name**: `missionwell-ai-engine`
* **Root Directory**: `ai-engine`
* **Runtime**: `Python`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Health Check Path**: `/health`
* **Environment Variables**:
  * `PYTHON_VERSION`: `3.11.9`
  * `NODE_ENV`: `production`

---

### 2. Deploy the Express REST API Backend (`missionwell-backend`)
* **Type**: Web Service
* **Name**: `missionwell-backend`
* **Root Directory**: `backend`
* **Runtime**: `Node`
* **Build Command**: `npm install --include=dev --no-workspaces && npm run build`
* **Start Command**: `node dist/server.js`
* **Health Check Path**: `/health`
* **Environment Variables**:
  * `NODE_VERSION`: `20.18.0`
  * `NODE_ENV`: `production`
  * `DATABASE_URL`: `file:./dev.db`
  * `AUTH_SECRET`: `missionwell-defense-jwt-secret-key-super-secure-32chars`
  * `ML_SERVICE_URL`: `https://missionwell-ai-engine.onrender.com` *(use your ai-engine service URL)*
  * `CORS_ORIGIN`: `https://missionwell-frontend.onrender.com` *(use your frontend service URL)*

---

### 3. Deploy the Next.js Web Frontend (`missionwell-frontend`)
* **Type**: Web Service
* **Name**: `missionwell-frontend`
* **Root Directory**: `frontend`
* **Runtime**: `Node`
* **Build Command**: `npm install --include=dev --no-workspaces && npm run build`
* **Start Command**: `npm start`
* **Health Check Path**: `/`
* **Environment Variables**:
  * `NODE_VERSION`: `20.18.0`
  * `DATABASE_URL`: `file:./dev.db`
  * `AUTH_SECRET`: `missionwell-defense-jwt-secret-key-super-secure-32chars`
  * `BACKEND_URL`: `https://missionwell-backend.onrender.com` *(use your backend service URL)*
  * `NEXT_PUBLIC_API_URL`: `https://missionwell-backend.onrender.com` *(use your backend service URL)*

---

## Method 3: Docker Deployment on Render

Render also supports native Docker deployments using the included Dockerfiles:

1. **Frontend**: [`frontend/Dockerfile`](../frontend/Dockerfile) (Multi-stage Node.js 20 Alpine)
2. **Backend**: [`backend/Dockerfile`](../backend/Dockerfile) (Multi-stage Node.js 20 Alpine)
3. **AI Engine**: [`ai-engine/Dockerfile`](../ai-engine/Dockerfile) (Python 3.11 slim with OpenMP)

---

## Post-Deployment Verification

Once your services show **"Live"** on Render:

1. **Verify AI Engine**:
   * Open `https://<your-ai-engine>.onrender.com/health` ➔ Should return `{"status": "healthy"}`.
   * Open `https://<your-ai-engine>.onrender.com/docs` ➔ Interactive FastAPI Swagger UI.

2. **Verify Backend**:
   * Open `https://<your-backend>.onrender.com/health` ➔ Should return `{"status": "healthy", "service": "MISSIONWELL AI - Backend API"}`.

3. **Verify Frontend**:
   * Open `https://<your-frontend>.onrender.com`.
   * Navigate to `/login`.
   * Click **"Google / Gmail" ➔ "Sign in with Google"** to test Google OAuth with `recmit2024@gmail.com`.
   * Click **"1-Click Personas"** to test instant evaluations across Welfare Officer, Commander, Personnel, and Admin roles.
