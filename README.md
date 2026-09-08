<div align="center">

# MissionWell AI (Sentinel of Resilience)
### **Predictive Wellness Monitoring & Operational Readiness for Safer, Stronger Forces**
*Ministry of Home Affairs (Police II Division) • Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, AR)*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM_AI-brightgreen?style=for-the-badge)](https://lightgbm.readthedocs.io/)
[![Google OAuth 2.0](https://img.shields.io/badge/Auth-Google_OAuth_2.0-4285F4?style=for-the-badge&logo=google)](https://developers.google.com/identity)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP_Act_2023-emerald?style=for-the-badge)](https://www.meity.gov.in/)
[![Tests Passing](https://img.shields.io/badge/Tests-23%2F23_Passed-success?style=for-the-badge)](tests/run-tests.js)

<br />

> ### *"Personnel wellbeing is mission readiness."*  
> **"सैनिक का कल्याण ही बल की सर्वोच्च तत्परता है।"**

</div>

---

## Table of Contents
- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Key Feature Highlights](#key-feature-highlights)
  - [1. Google OAuth 2.0 & Identity Chooser](#1-google-oauth-20--identity-chooser)
  - [2. Dual Appearance Engine (Light & Dark Themes)](#2-dual-appearance-engine-light--dark-themes)
  - [3. Multi-Branch Force Customization](#3-multi-branch-force-customization)
  - [4. Downloadable Official Welfare & Operational Reports](#4-downloadable-official-welfare--operational-reports)
  - [5. Role-Based Access Control (RBAC) & DPDP Act 2023](#5-role-based-access-control-rbac--dpdp-act-2023)
  - [6. Calibrated Machine Learning & SHAP Explainability](#6-calibrated-machine-learning--shap-explainability)
  - [7. Buddy-Pair System & Confidential Darbar Requests](#7-buddy-pair-system--confidential-darbar-requests)
- [Monorepo Directory Structure](#monorepo-directory-structure)
- [Quick Start Guide](#quick-start-guide)
  - [Option A: 1-Command Unified Tri-Service Runner](#option-a-1-command-unified-tri-service-runner-recommended)
  - [Option B: Manual Service-by-Service Execution](#option-b-manual-service-by-service-execution)
- [Automated Integration & Security Test Suite](#automated-integration--security-test-suite)
- [API Documentation Overview](#api-documentation-overview)
- [Hackathon Evaluator Sandbox](#hackathon-evaluator-sandbox)
- [Submission & Team Details](#submission--team-details)
- [Statutory Disclaimer](#statutory-disclaimer)

---

## Executive Summary

**MissionWell AI** is an authentic, defense-grade predictive wellness intelligence platform engineered specifically for **the Indian Army, Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, NSG), and State Police forces**.

In high-stress operational environments—such as Counter-Insurgency grids in Bastar/Sukma, extreme High-Altitude snow-bound forward posts in Siachen/Ladakh (-35°C), remote Border Outposts (BOPs) in the Thar Desert, or grueling 14-hour law-and-order bandobast duties—personnel face cumulative operational fatigue, sleep debt, and prolonged family separation.

Traditional armed forces welfare workflows are strictly reactive, waiting for acute breakdown or formal grievances. **MissionWell AI** transforms welfare into an **evidence-based, proactive continuum** that identifies early indicators of fatigue and burnout without medical jargon, stigmatization, or career penalty.

---

## System Architecture

```
                                  +---------------------------------------+
                                  |         Next.js 16 Frontend           |
                                  |  (React 19, Tailwind CSS, Lucide)     |
                                  |  Port: 3000                           |
                                  +-------------------+-------------------+
                                                      |
                             REST & Session Cookies   |   OAuth Redirect & Callbacks
                                                      v
                                  +---------------------------------------+
                                  |         Node.js Express Backend       |
                                  |  (TypeScript, Prisma ORM, Jose JWT)   |
                                  |  Port: 5000                           |
                                  +---------+-------------------+---------+
                                            |                   |
                        SQLite Database     |                   |  REST Telemetry
                       (dev.db / Postgres)  |                   |  Inference Request
                                            v                   v
                        +----------------------+    +----------------------+
                        |  Prisma Database     |    |  Python ML Engine    |
                        |  - Users & Roles     |    |  (FastAPI, LightGBM) |
                        |  - Assessments       |    |  - TreeExplainer     |
                        |  - Clinical Cases    |    |  - SHAP Drivers      |
                        |  - Audit Log Trail   |    |  Port: 8000          |
                        +----------------------+    +----------------------+
```

---

## Key Feature Highlights

### 1. Google OAuth 2.0 & Identity Chooser
* **Standard OAuth 2.0 Authorization Flow**:
  * Constructs official Google OAuth consent URLs (`https://accounts.google.com/o/oauth2/v2/auth`) with `openid`, `userinfo.email`, and `userinfo.profile` scopes, state nonces, and offline access.
  * Real-time ID token / One-Tap verification via Google's `https://oauth2.googleapis.com/tokeninfo` endpoint.
  * Dedicated redirect callback page at [`/auth/callback`](frontend/app/auth/callback/page.tsx) with cryptographic progress animations and automated session token storage.
* **Interactive Evaluator Account Chooser Dialog**:
  * Faithful `accounts.google.com` aesthetic: authentic multi-colored Google logo, account selector pills, and DPDP Act 2023 compliance badge.
  * 1-Click evaluation accounts for Dr. Aarti Sharma (Welfare), Col. Vikram Rathore (Commander), Ct. Piyush Kumar (Personnel), and Sh. Rajesh Patel (Admin).
  * Custom Gmail input form allowing any judge email to auto-provision with custom rank and branch.

### 2. Dual Appearance Engine (Light & Dark Themes)
* **Human-Made Visual Aesthetics**: Built with tailored HSL color tokens, dark mode elevation rings, and sleek glassmorphism.
* **Full Theme Support**:
  * **Military Night-Vision / Dark Theme (`#090D16` / `#0F172A`)**: Protects night vision during tactical operations and reduces eye strain in 24/7 control rooms.
  * **Clean Daylight Theme (`slate-50` / `#FFFFFF`)**: Crisp, high-contrast, document-ready view for daytime administrative and medical dossier reviews.
  * **System Sync**: Automatically honors OS-level preference with instant 1-click toggling.

### 3. Multi-Branch Force Customization
Dynamically adapts terminology, battalion organizational hierarchies, badges, and operational benchmarks:
* **CRPF**: Motto *"Service and Loyalty / सेवा और निष्ठा"* • LWE Counter-Insurgency & Internal Security.
* **Indian Army**: Motto *"Service Before Self / सेवा परमो धर्मः"* • High-Altitude Warfare (Siachen / Leh / Eastern Ladakh).
* **BSF**: Motto *"Duty Unto Death / जीवन पर्यन्त कर्तव्य"* • International Border Outposts (BOPs).
* **ITBP**: Motto *"Valour - Steadfastness - Commitment / शौर्य - दृढ़ता - कर्म निष्ठा"* • Himalayan High-Altitude Grids.
* **CISF**: Motto *"Protection and Security / संरक्षण एवं सुरक्षा"* • Critical Infrastructure & Aviation Security.
* **State Police**: Motto *"सद्रक्षणाय खलनिग्रहणाय"* • Law & Order, 14-Hour Bandobast, and PCR Operations.

### 4. Downloadable Official Welfare & Operational Reports
* **High-Resolution Formatted CSV Export**:
  * Generates structured CSV data with force headers, timestamp metadata, unit-wise personnel counts, distress indicators, and intervention counts.
  * Accessible via `/api/reports/download?format=csv`.
* **Printable Executive HTML & PDF Dossiers**:
  * Renders official Government of India / MHA emblem insignia, force watermarks, classification stamps, and auto-embedded browser print triggers (`window.print()`).
  * Accessible via `/api/reports/download?format=html`.

### 5. Role-Based Access Control (RBAC) & DPDP Act 2023
* **Zero-Stigmatization Guarantee**: Disclosures never affect Annual Confidential Reports (ACR) or Annual Performance Appraisals (APAR).
* **Strict Privacy Matrix**:

| Feature / Resource | Personnel (Jawan) | Welfare Officer (Doctor) | Commander (CO) | System Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Voluntary Self-Assessments** | Private Self-Care | Clinical Dossier Access | **Strictly Blocked (403)** | Blocked |
| **Counseling & Therapy Notes** | Private Self-Care | Doctor-Patient Only | **Strictly Blocked (403)** | Blocked |
| **Unit Aggregated Heatmaps** | Blocked | View & Triage | Anonymized Operational | View & Audit |
| **Official Report Downloads** | **Blocked (403)** | Printable HTML & CSV | Operational CSV & HTML | Full Access |
| **Immutable Audit Logs** | Blocked | Blocked | Blocked | Full Cryptographic Log |

### 6. Calibrated Machine Learning & SHAP Explainability
* **Model Engine**: Multi-Class Gradient Boosted Decision Tree (LightGBM).
* **Calibrated Performance**:
  * Raw Accuracy: 77.9%
  * Balanced Accuracy: 78.4%
  * Macro F1-Score: 0.773
  * Calibrated deliberately to reflect nuanced physiological transitions between fatigue states.
* **SHAP Explainability**: TreeExplainer ranks top stress drivers (e.g. sleep debt, continuous field days, social isolation) per assessment.
* **Anti-Masking Guardrail**: Detects symptom suppression and false bravado by cross-referencing survey latency (<15s) with elevated resting heart rates.

### 7. Buddy-Pair System & Confidential Darbar Requests
* **Buddy-Pair Watch (बडी-पेयर)**: Confidential 1-tap peer check-in (*"मेरा साथी सुरक्षित एवं ठीक है"* vs. *"साथी को विश्राम / सहायता की आवश्यकता है"*).
* **Confidential CO/SM Darbar**: Direct audience requests with the Battalion Commanding Officer or Subedar Major, bypassing middle administrative filtering.

---

## Monorepo Directory Structure

```
Codecatalyst/
├── frontend/                     # Next.js 16 App Router (React 19, TypeScript, Tailwind CSS)
│   ├── app/                      # App router pages & layouts
│   │   ├── (dashboard)/          # Authenticated routes (welfare, commander, analytics, reports, etc.)
│   │   ├── api/                  # Next.js API route proxies (auth, login, google, etc.)
│   │   ├── auth/callback/        # Dedicated Google OAuth redirect callback page
│   │   └── login/                # Multi-tab login portal (Credentials, Google SSO, Evaluator Personas)
│   ├── components/               # Reusable UI widgets, theme switchers, and layout bars
│   │   └── auth/                 # Google OAuth account chooser & consent dialog
│   ├── lib/                      # Database client, JWT crypto, password hashing, and force metadata
│   ├── services/                 # Decoupled frontend API consumer services
│   ├── types/                    # Strict TypeScript type definitions
│   └── package.json              # Frontend package configuration
│
├── backend/                      # Node.js Express REST API backend
│   ├── src/
│   │   ├── controllers/          # Decoupled route controllers (auth, case, wellness, report, audit)
│   │   ├── middleware/           # RBAC validation and JWT cookie guards
│   │   ├── routes/               # Express route registrations
│   │   ├── services/             # Core business logic (GoogleAuth, Welfare, Risk, Reports, Audit)
│   │   └── server.ts             # Express application initialization
│   ├── prisma/                   # Database schema definitions and seed scripts
│   └── package.json              # Backend package configuration
│
├── ai-engine/                    # Python FastAPI microservice (LightGBM Stress Engine)
│   ├── data/                     # 5,000 synthetic defense stress records
│   ├── models/                   # defense_stress_lgbm_model.joblib
│   ├── src/                      # Feature pipeline, inference predictor, SHAP TreeExplainer
│   ├── main.py                   # FastAPI application (/predict, /model-info, /health)
│   └── requirements.txt          # Python dependencies
│
├── tests/                        # Automated test suites
│   └── run-tests.js              # 23-point end-to-end integration & security test runner
│
├── start-all.js                  # Tri-service local runner & orchestrator
├── package.json                  # Root monorepo scripts
└── README.md                     # Master platform documentation
```

---

## Quick Start Guide

### Prerequisites
* **Node.js**: v18+ (Node 20+ recommended)
* **Python**: v3.9+ (Python 3.10/3.11 recommended)
* **npm** or **pnpm**

---

### Option A: 1-Command Unified Tri-Service Runner (Recommended)

Run the entire system (Frontend, Backend API, and ML Microservice) with a single command:

```bash
# Clone the repository
git clone https://github.com/Pk1823/Codecatalyst.git
cd Codecatalyst/MW

# Install dependencies across services (if first time)
cd frontend && npm install && cd ../backend && npm install && cd ..
pip install -r ai-engine/requirements.txt

# Launch all 3 services concurrently
node start-all.js
```

The unified runner automatically checks ports and launches:
* **Frontend Portal**: [http://localhost:3000](http://localhost:3000)
* **Backend REST API**: [http://localhost:5000](http://localhost:5000)
* **ML Inference Microservice**: [http://localhost:8000](http://localhost:8000)

---

### Option B: Manual Service-by-Service Execution

#### 1. Python ML Engine (Port 8000)
```bash
cd ai-engine
pip install -r requirements.txt
python main.py
```
* Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Express REST API Backend (Port 5000)
```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```
* Backend Health Check: [http://localhost:5000/health](http://localhost:5000/health)

#### 3. Next.js Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
* Application Portal: [http://localhost:3000](http://localhost:3000)

---

## Deploy to Render (Cloud Hosting)

The platform includes a pre-configured **Render Blueprint** ([`render.yaml`](render.yaml)) and multi-stage Dockerfiles for 1-click automated deployment to [Render](https://render.com).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Pk1823/Codecatalyst)

### Option 1: 1-Click Render Blueprint (Recommended)
1. Navigate to [dashboard.render.com](https://dashboard.render.com) and click **"New +" ➔ "Blueprint"**.
2. Connect your GitHub repository: `https://github.com/Pk1823/Codecatalyst.git`.
3. Render automatically detects [`render.yaml`](render.yaml) and provisions:
   * **`missionwell-ai-engine`**: Python 3.11 FastAPI microservice with LightGBM & SHAP.
   * **`missionwell-backend`**: Node.js Express REST API with Prisma ORM.
   * **`missionwell-frontend`**: Next.js 16 App Router web portal.
4. Click **"Apply"** to deploy all services concurrently.

Detailed documentation is available in the [**Render Cloud Deployment Guide**](docs/RENDER_DEPLOYMENT.md).

---

## Automated Integration & Security Test Suite

The repository includes a comprehensive 23-step automated test suite covering RBAC, DPDP Act 2023 compliance, Machine Learning inference, report downloads, and Google OAuth 2.0:

```bash
node tests/run-tests.js
```

### Verified Test Matrix
```text
================================================================
 MISSIONWELL AI — INTEGRATION & RBAC SECURITY TEST SUITE
 Organization: Ministry of Home Affairs | CRPF Police II Div
================================================================

[TEST 1] Public Health Check Endpoint: ✅ PASSED
[TEST 2] Authentication: Personnel Sign-In: ✅ PASSED
[TEST 3] Authentication: Welfare Officer Sign-In: ✅ PASSED
[TEST 4] Authentication: Commander Sign-In: ✅ PASSED
[TEST 5] Authentication: Admin Sign-In: ✅ PASSED
[TEST 6] RBAC: PERSONNEL Denied Access to Welfare Cases (403): ✅ PASSED
[TEST 7] RBAC: PERSONNEL Denied Creating Clinical Cases (403): ✅ PASSED
[TEST 8] RBAC: PERSONNEL Denied Access to Aggregated Operational Reports (403): ✅ PASSED
[TEST 9] RBAC: Non-Admin Denied Access to Cryptographic Audit Logs (403): ✅ PASSED
[TEST 10] Data Privacy: Commander Reads Personnel Profile (Granular Survey Redacted): ✅ PASSED
[TEST 11] End-to-End: Personnel Submits Voluntary Wellness Assessment: ✅ PASSED
[TEST 12] End-to-End: Welfare Officer Triages Auto-Created Welfare Case: ✅ PASSED
[TEST 13] End-to-End: Welfare Officer Progresses Case Status & Adds Clinical Note: ✅ PASSED
[TEST 14] End-to-End: Welfare Officer Records Intervention Support Action: ✅ PASSED
[TEST 15] End-to-End: Commander Views Aggregated Operational Heatmap & Trends: ✅ PASSED
[TEST 16] End-to-End: Commander Downloads Official Welfare Report in CSV Format: ✅ PASSED
[TEST 17] End-to-End: Welfare Officer Downloads Official Welfare Report in Printable HTML/PDF: ✅ PASSED
[TEST 18] Security RBAC: Personnel Role Strictly Forbidden from Downloading Operational Reports (403): ✅ PASSED
[TEST 19] End-to-End: Admin Verifies Immutable Audit Trail: ✅ PASSED
[TEST 20] Google OAuth 2.0: Generate Authorization Consent URL: ✅ PASSED
[TEST 21] Google OAuth 2.0: Authenticate Profile & Issue Session JWT: ✅ PASSED
[TEST 22] Google OAuth 2.0: Reject Malformed Callback Code (400): ✅ PASSED
[TEST 23] Google OAuth 2.0: DPDP Act 2023 Audit Trail Verification: ✅ PASSED

================================================================
 TEST RUN COMPLETE: 23/23 TESTS PASSED (100% PASS RATE)
================================================================
```

---

## API Documentation Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status | Public |
| `POST` | `/api/auth/login` | Login with Service ID or Persona | Public |
| `GET` | `/api/auth/google/url` | Generate Google OAuth 2.0 authorization consent URL | Public |
| `POST` | `/api/auth/google/callback` | Exchange OAuth code for profile & session cookie | Public |
| `POST` | `/api/auth/google` | Google SSO / ID Token authentication & auto-provisioning | Public |
| `POST` | `/api/auth/logout` | Invalidate session cookie & write audit log | Authenticated |
| `GET` | `/api/auth/session` | Fetch verified session claims | Authenticated |
| `POST` | `/api/wellness/assessments` | Submit voluntary wellness survey & trigger ML inference | Personnel |
| `GET` | `/api/cases` | Retrieve active clinical welfare cases | Welfare Officer, Admin |
| `POST` | `/api/cases/:id/interventions` | Record proactive wellness intervention | Welfare Officer |
| `GET` | `/api/reports` | View aggregated unit stress heatmap | Commander, Welfare Officer |
| `GET` | `/api/reports/download` | Download official reports (`format=csv` or `format=html`) | Commander, Welfare Officer |
| `GET` | `/api/audit-logs` | Retrieve immutable access audit logs | Admin Only |

---

## Hackathon Evaluator Sandbox

For rapid evaluation without manual database seeding or Google Cloud credentials, open [http://localhost:3000/login](http://localhost:3000/login) and use:

### 1. Instant 1-Click Evaluation Personas (Tab: "1-Click Personas")
* **Welfare Officer / Doctor**: `Dr. Aarti Sharma` (Chief Medical Officer, CRPF) — Clinical Dossiers, SHAP Factors, and Triage.
* **Battalion Commander**: `Col. Vikram Rathore` (Commandant Ops, BSF) — Unit Readiness Grid, Operational Reports.
* **Active Personnel**: `Ct. Piyush Kumar` (Constable GD, ITBP) — Voluntary Assessment, Buddy-Pair Check-in.
* **System Administrator**: `Sh. Rajesh Patel` (Systems Director, MHA) — Cryptographic Audit Trail, DPDP Logs.

### 2. Google OAuth 2.0 Evaluation (Tab: "Google / Gmail")
* Click **"Sign in with Google"** to launch the interactive Google Account Chooser.
* Click on any preconfigured Google persona or enter your personal Gmail address to test dynamic account provisioning.

---

## Submission & Team Details

* **Project:** MissionWell AI (Sentinel of Resilience)
* **Team:** Codecatalyst
* **Deployment Scope:** Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, AR) & Armed Forces Welfare Divisions
* **Organization:** Central Reserve Police Force (CRPF) / Police II Division, Ministry of Home Affairs (MHA), Government of India
* **Repository:** [https://github.com/Pk1823/Codecatalyst.git](https://github.com/Pk1823/Codecatalyst.git)

---

## Statutory Disclaimer

MissionWell AI provides operational fatigue and wellness intelligence for authorized welfare and command personnel. It does **NOT** provide automated clinical psychiatric diagnoses or punitive disciplinary recommendations. Personal disclosures are protected under strict medical privacy standards and the **Digital Personal Data Protection (DPDP) Act 2023**.

---

<div align="center">
<b>Built with pride for the Guardians of our Nation 🇮🇳</b><br />
<i>"Service and Loyalty" • "Duty Unto Death" • "Valour - Steadfastness - Commitment"</i>
</div>
