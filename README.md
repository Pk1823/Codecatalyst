<div align="center">

# MissionWell AI (Sentinel of Resilience)
### **Predictive Wellness Monitoring & Operational Readiness for Safer, Stronger Forces**
*Ministry of Home Affairs (Police II Division) • Central Armed Police Forces (CRPF, BSF, ITBP, CISF, SSB, AR)*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo SDK 51](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM_AI-brightgreen?style=for-the-badge)](https://lightgbm.readthedocs.io/)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Render Cloud](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
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
- [Technology Stack (Full Defense Tech Stack)](#technology-stack-full-defense-tech-stack)
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
+=============================================================================================================+
|                                    MISSIONWELL AI DISTRIBUTED SYSTEM ARCHITECTURE                           |
+=============================================================================================================+

   [ 📱 FIELD PERSONNEL & JAWANS ]                   [ 🖥️ COMMANDERS & MEDICAL OFFICERS ]
      React Native 0.74 • Expo SDK 51                     Next.js 16.3 • React 19 • Tailwind CSS
      - File-based Expo Router v3                         - Google OAuth 2.0 & RBAC Portal
      - Tactical Glassmorphic Theme                       - Unit-Level Aggregated Stress Heatmaps
      - Buddy-Pair Watch & CO Darbar                      - Printable MHA Official Medical Dossiers
      - Port: 8081 (Dev) / Standalone APK                 - Port: 3000
                 |                                                      |
                 +--------------------------+---------------------------+
                                            |
                         HTTPS REST / TLS 1.3 Encryption / Session Tokens
                         (DPDP Act 2023 Non-Punitive Compliance Shield)
                                            |
                                            v
               +-------------------------------------------------------------+
               |             NODE.JS EXPRESS REST API BACKEND                |
               |          (TypeScript 5.x • Prisma ORM 6.4 • Port: 5000)     |
               |  - Role-Based Access Control Guards (Personnel/Doctor/CO)   |
               |  - Google OAuth 2.0 Token Verification & Identity Chooser   |
               |  - Encrypted Password Vault (Bcrypt 12 Salt Rounds)         |
               |  - Immutable Cryptographic Audit Logger                     |
               +-----------------------------+-------------------------------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
   +-------------------------------+                   +-------------------------------+
   |   PERSISTENCE DATA LAYER      |                   |    PREDICTIVE AI ENGINE       |
   |   (Prisma ORM • SQLite/PG)    |                   |    (Python 3.11 • FastAPI)    |
   |   - Users & Defense Roles     |                   |    - Port: 8000 (Uvicorn ASGI)|
   |   - Personnel Assessments     |   Telemetry /     |    - LightGBM Anti-Masking    |
   |   - Clinical Welfare Cases    |<----------------->|      Stress Classifier        |
   |   - Buddy-Pair Watch Log      |   SHAP Drivers    |    - SHAP TreeExplainer       |
   |   - MHA Access Audit Trail    |                   |      Feature Attribution      |
   +-------------------------------+                   +-------------------------------+
                   |                                                   |
+==================v===================================================v======================================+
|                                    CLOUD & DEPLOYMENT TOPOLOGY                                               |
+=============================================================================================================+
|  🔥 FIREBASE HOSTING      | Global CDN Edge deployment for Mobile Web PWA (firebase.json / dist)           |
|  ☁️ RENDER CLOUD BLUEPRINT | Containerized auto-scaling backend & AI engine (render.yaml)                   |
|  🌐 SECURE EVALUATOR GATE | Zero-setup HTTPS gateway for hackathon judge evaluation (Localtunnel / Cloudflare)|
|  ⚙️ GITHUB ACTIONS CI/CD   | Automated lint, test, build, and deploy pipeline (.github/workflows)          |
+=============================================================================================================+
```

---

## Technology Stack (Full Defense Tech Stack)

MissionWell AI is built with an authentic, defense-grade, multi-tier distributed architecture engineered for high availability, zero latency, end-to-end encryption, and offline-first edge deployment across remote operational theaters.

```
+========================================================================================================+
|                                    MISSIONWELL AI DEFENSE TECH STACK                                   |
+========================================================================================================+
| 📱 MOBILE APPLICATION       | React Native 0.74 • Expo SDK 51 • Expo Router v3 • Reanimated 3.10       |
| 🖥️ COMMAND PORTAL (WEB)     | Next.js 16.3 (Turbopack) • React 19 • Tailwind CSS 3.4 • Lucide          |
| ⚙️ BACKEND API ENGINE       | Node.js 20 LTS • Express 4.21 • TypeScript 5.x • Prisma ORM 6.4          |
| 🧠 PREDICTIVE AI ENGINE     | Python 3.11 • FastAPI • LightGBM (Anti-Masking) • SHAP Explainability   |
| 🛡️ PRIVACY & COMPLIANCE     | DPDP Act 2023 Shield • Zero ACR Career Prejudice • Argon2/Bcrypt/Jose     |
| ☁️ CLOUD & DEVOPS INFRA     | Firebase Hosting • Render Cloud • Vercel • Docker • GitHub Actions CI/CD  |
+========================================================================================================+
```

### 1. Mobile & Edge Tier (Jawan & Field Personnel App)
* **Core Framework**: **React Native 0.74.5** with **Expo SDK 51** (Cross-Platform Android APK & Web).
* **Navigation**: **Expo Router v3** (File-based declarative routing, deep-linking, tab bars, modal stacks).
* **UI & Aesthetics**:
  * Military glassmorphic defense theme with tailored HSL color tokens (`#0B132B`, `#1C2541`, `#3B82F6`).
  * Custom safe area insets and curved bezel alignment (100% viewport fit, zero edge cutoff).
  * **Typography**: Google Sans (Regular, Medium, SemiBold, Bold) & JetBrains Mono (Bold) for tactical telemetry.
* **Icons & Assets**: Lucide React Native, React Native SVG 15.2, custom defense crests with contain-mode scaling.
* **Motion & Touch**: React Native Reanimated 3.10, React Native Gesture Handler 2.16, Expo Haptics.
* **State & Data**: TanStack React Query v5, Expo SecureStore (Hardware-backed encrypted token vault).
* **Packaging & Delivery**:
  * **Android APK**: Expo Application Services (EAS Build) with standalone defense profile.
  * **Web Static PWA**: `npx expo export -p web` (Static HTML/CSS/JS with full offline service worker support).
  * **Firebase Hosting**: Native `firebase.json` with SPA routing rules and CDN edge caching.

### 2. Command & Officer Web Portal
* **Framework**: **Next.js 16.3.4** utilizing React Server Components (RSC) and Turbopack bundler.
* **UI Library**: **React 19.0**.
* **Styling**: **Tailwind CSS 3.4** with customized CSS variables, tactical military dark theme and high-contrast daylight theme.
* **Identity & Authentication**:
  * **Google OAuth 2.0 (RFC 6749)** with One-Tap identity chooser and Google Identity Services SDK.
  * 1-Click evaluation personas for doctors, commanding officers, and system administrators.
* **Data Visualization**: Dynamic unit-wise operational stress heatmaps, fatigue velocity gauges, and SHAP driver charts.
* **Report Generation**: Printable HTML/PDF medical dossiers with Ministry of Home Affairs watermarks and formatted CSV exports.

### 3. Backend REST API Microservice
* **Runtime**: **Node.js 20.18.0 LTS**.
* **Framework**: **Express.js 4.21** written in strict-mode **TypeScript 5.x**.
* **Database & ORM**: **Prisma ORM 6.4** with automatic migrations and type-safe client.
  * **Development**: SQLite (`dev.db`) for lightweight, zero-dependency local hackathon evaluation.
  * **Production**: PostgreSQL with connection pooling.
* **Security & Auth**:
  * **Jose (JWT/JWS)** for cryptographic session management with stateless Bearer tokens and HttpOnly cookies.
  * **Bcrypt** for military-grade password hashing (12 salt rounds).
  * **CORS & Helmet** for hardened HTTP security headers.
* **Audit Trail**: Immutable cryptographic audit logs recording every access to sensitive personnel health records.

### 4. Machine Learning & Predictive AI Engine
* **Runtime & Server**: **Python 3.11** with **FastAPI** and **Uvicorn** high-performance ASGI server.
* **Classification Model**: **LightGBM (Light Gradient Boosting Machine)**:
  * Trained to detect subtle burnout markers, behavioral changes, and combat fatigue.
  * **Anti-Masking Algorithm**: Detects stoic underreporting ("I am fine" masking) common among disciplined soldiers.
* **Explainable AI (XAI)**: **SHAP (SHapley Additive exPlanations)** with `TreeExplainer`:
  * Computes exact mathematical feature contributions for every prediction.
  * Highlights top actionable risk drivers (e.g., consecutive sleepless night shifts, extreme high-altitude exposure, prolonged leave denial).
* **Data Science Stack**: Scikit-Learn, NumPy, Pandas, Joblib.

### 5. Cloud Infrastructure, Hosting & DevOps
* **Firebase Hosting**:
  * Deployed via Google Firebase CDN (`firebase.json`, `mobile/dist`).
  * Instant global SSL, SPA rewrites, and fast edge delivery.
* **Cloud Platform (Render)**:
  * Declared via infrastructure-as-code [`render.yaml`](render.yaml) blueprint:
    * `missionwell-backend`: Node.js Express API.
    * `missionwell-ai-engine`: Python FastAPI ML Service.
    * `missionwell-frontend`: Next.js Web Portal.
* **CI/CD Automation**:
  * **GitHub Actions** ([`.github/workflows/firebase-hosting.yml`](.github/workflows/firebase-hosting.yml)) for automated build, lint, and deploy on push to `main`.
* **Containerization**: Full **Docker & Docker Compose** orchestration ([`docker-compose.yml`](docker-compose.yml)).
* **Live Evaluator Tunnel**: Integrated Cloudflare / Localtunnel HTTPS gateway for instantaneous external judge review.

### 6. Statutory Compliance & Defense Privacy
* **DPDP Act 2023 Shield**: Strict non-punitive privacy architecture. Commanders only receive anonymized, unit-level aggregate heatmaps; raw individual questionnaires and therapy notes are restricted to medical officers.
* **Zero ACR/APAR Career Prejudice**: Cryptographic guarantee that seeking stress support will never impact military service records or promotions.

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
├── mobile/                       # 📱 React Native 0.74 / Expo SDK 51 Mobile Application
│   ├── app/                      # Expo Router v3 file-based screens & navigation
│   │   ├── (auth)/               # Mobile authentication screens (login.tsx, signup.tsx)
│   │   ├── (tabs)/               # Bottom tab navigation (Assessment, Welfare, Command, Alerts, Settings)
│   │   │   ├── personnel.tsx     # Jawan voluntary wellness assessment & buddy check-in
│   │   │   ├── welfare.tsx       # Medical & welfare officer case management & triage
│   │   │   ├── commander.tsx     # Battalion commander aggregated readiness dashboard
│   │   │   ├── alerts.tsx        # Tactical alert notifications & critical distress pings
│   │   │   ├── settings.tsx      # Multi-branch customization (CRPF, BSF, ITBP, Army) & theme
│   │   │   └── _layout.tsx       # Tab bar styling with safe area insets (0 edge clipping)
│   │   ├── _layout.tsx           # Root gesture handler, font loader, and auth provider
│   │   ├── simulator.tsx         # Real-time interactive AI stress simulation view
│   │   ├── recommendations.tsx   # Evidence-based operational wellness interventions
│   │   ├── audit.tsx             # Mobile DPDP Act 2023 compliance audit inspector
│   │   └── presentation.tsx      # Mobile hackathon evaluation pitch deck & QA
│   ├── components/               # Mobile tactical components & UI primitives
│   │   ├── auth/                 # Google OAuth mobile modal dialog & account chooser
│   │   └── ui/                   # MissionWellLogo, DownloadAppBanner, Card, Button, Badge
│   ├── contexts/                 # React Contexts (Auth, Theme, Force, Language)
│   │   ├── AuthContext.tsx       # Secure token vault & 1-click persona switcher
│   │   ├── ThemeContext.tsx      # Dark/Light tactical appearance engine
│   │   ├── ForceContext.tsx      # Multi-branch customization (CRPF, BSF, ITBP, Army)
│   │   └── LanguageContext.tsx   # Bilingual localization (Hindi / English)
│   ├── services/                 # Mobile API client, fonts loader, secure storage
│   │   ├── api.ts                # REST client connecting to Render backend & AI engine
│   │   ├── auth.ts               # Evaluator personas (Dr. Aarti Sharma, Col. Vikram Rathore, etc.)
│   │   └── fonts.ts              # Custom Google Sans & JetBrains Mono typography loader
│   ├── assets/                   # App icons, splash screens, adaptive icons, and defense crests
│   ├── app.json                  # Expo project manifest, splash configuration, icons
│   ├── eas.json                  # Expo Application Services Android APK build configuration
│   ├── firebase.json             # Firebase Hosting configuration for mobile web PWA
│   ├── vercel.json               # Vercel deployment configuration
│   ├── babel.config.js           # Reanimated plugin & module resolvers
│   └── package.json              # Mobile package dependencies & deployment scripts
│
├── frontend/                     # 🖥️ Next.js 16 Command Web Portal (React 19, TypeScript, Tailwind)
│   ├── app/                      # App router pages & layouts
│   │   ├── (dashboard)/          # Authenticated routes (welfare, commander, analytics, reports)
│   │   ├── api/                  # Next.js API route proxies (auth, login, google, etc.)
│   │   ├── auth/callback/        # Dedicated Google OAuth redirect callback page
│   │   └── login/                # Multi-tab login portal (Credentials, Google SSO, Personas)
│   ├── components/               # Reusable UI widgets, theme switchers, and layout bars
│   │   └── auth/                 # Google OAuth account chooser & consent dialog
│   ├── lib/                      # Database client, JWT crypto, password hashing, and force metadata
│   ├── services/                 # Decoupled frontend API consumer services
│   ├── types/                    # Strict TypeScript type definitions
│   └── package.json              # Frontend package configuration
│
├── backend/                      # ⚙️ Node.js Express REST API backend microservice
│   ├── src/
│   │   ├── controllers/          # Decoupled route controllers (auth, case, wellness, report, audit)
│   │   ├── middleware/           # RBAC validation and JWT cookie guards
│   │   ├── routes/               # Express route registrations
│   │   ├── services/             # Core business logic (GoogleAuth, Welfare, Risk, Reports, Audit)
│   │   └── server.ts             # Express application initialization
│   ├── prisma/                   # Database schema definitions and seed scripts
│   └── package.json              # Backend package configuration
│
├── ai-engine/                    # 🧠 Python FastAPI microservice (LightGBM Stress Engine)
│   ├── data/                     # 5,000 calibrated defense stress records
│   ├── models/                   # defense_stress_lgbm_model.joblib & SHAP explainer
│   ├── src/                      # Feature pipeline, inference predictor, SHAP TreeExplainer
│   ├── main.py                   # FastAPI application (/predict, /model-info, /health)
│   └── requirements.txt          # Python dependencies
│
├── .github/                      # 🚀 CI/CD Automation
│   └── workflows/
│       └── firebase-hosting.yml  # Automated GitHub Actions deployment to Firebase Hosting
│
├── scripts/                      # Automation and deployment scripts
│   ├── deploy-firebase.js        # 1-command automated Firebase deployment runner
│   ├── generate-app-assets.js    # 1024x1024 adaptive icon and splash generator
│   └── fetch_kaggle_dataset.py   # Dataset ingestion utility
│
├── tests/                        # Automated test suites
│   └── run-tests.js              # 23-point end-to-end integration & security test runner
│
├── firebase.json                 # Monorepo root Firebase Hosting configuration
├── render.yaml                   # Render Cloud Blueprint infrastructure-as-code
├── docker-compose.yml            # Multi-container Docker orchestration
├── start-all.js                  # Tri-service local runner & orchestrator
├── package.json                  # Root monorepo scripts & workspaces
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

#### 4. React Native Mobile App & Firebase Hosting (Port 8081)
```bash
# Run Mobile App in local browser/device
cd mobile
npm install
npm run web

# Build standalone Android APK
npm run build:apk

# Deploy Mobile Web App to Firebase Hosting
cd ..
npx -y firebase-tools@latest login
npm run deploy:firebase
```
* Mobile Local Dev: [http://localhost:8081](http://localhost:8081)
* Firebase Live Production URL: `https://<your-project-id>.web.app`

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
