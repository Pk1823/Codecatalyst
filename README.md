<div align="center">

# MissionWell AI (Sentinel of Resilience)
### **Predictive Wellness Monitoring for Safer, Stronger Forces**
*Smart India Hackathon • Problem Statement 26186 • Ministry of Home Affairs (Police II Division) / CRPF*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LightGBM](https://img.shields.io/badge/Model-LightGBM_AI-brightgreen?style=for-the-badge)](https://lightgbm.readthedocs.io/)
[![DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP_Act_2023-emerald?style=for-the-badge)](https://www.meity.gov.in/)

<br />

> ### *"Personnel wellbeing is mission readiness."*  
> **"सैनिक का कल्याण ही बल की सर्वोच्च तत्परता है।"**

</div>

---

## Executive Summary

**MissionWell AI** is an authentic, defense-grade predictive wellness intelligence platform engineered specifically for **the Indian Army, Central Armed Police Forces (CRPF, BSF, ITBP, CISF), and State Police forces**.

In high-stress operational environments—such as Counter-Insurgency grids in Bastar/Sukma, extreme High-Altitude snow-bound forward posts in Siachen/Ladakh (-35 deg C), remote Border Outposts (BOPs) in the Thar Desert, or grueling 14-hour law-and-order bandobast duties—personnel face cumulative operational fatigue, sleep deprivation, and prolonged separation from families.

Traditional welfare methods are reactive, waiting for acute breakdown or formal grievances. **MissionWell AI** transforms welfare into an **evidence-based, proactive continuum** that identifies early indicators of fatigue and burnout without medical jargon, stigmatization, or career penalty.

---

## Repository Architecture

This repository is organized as a monorepo containing the production web application and the Python AI inference microservice:

```
Codecatalyst/
├── frontend/             # Production Next.js 16 App Router frontend (React 19, TypeScript, Tailwind)
│   ├── app/              # Dashboard and Public Routes (Landing, Login, Personnel, Welfare, Commander, Analytics, etc.)
│   ├── components/       # UI components, layout topbar, sidebar, Recharts widgets, role guards
│   ├── lib/              # Force metadata, AI HTTP client, mock datasets, utility helpers
│   ├── services/         # Decoupled frontend API service layers (Risk, Welfare, Auth, Analytics)
│   ├── types/            # Strict TypeScript interfaces
│   ├── package.json      # Frontend package configuration
│   └── tsconfig.json     # TypeScript strict configuration
│
├── ai-engine/            # Python FastAPI microservice with trained LightGBM ML model
│   ├── data/             # Synthetic unbiased defense stress telemetry dataset (5,000 records)
│   ├── models/           # defense_stress_lgbm_model.joblib (Calibrated 78.4% balanced accuracy)
│   ├── notebooks/        # Data generator and model training pipelines
│   ├── src/              # Feature engineering, StressPredictor with anti-masking and SHAP TreeExplainer
│   ├── main.py           # FastAPI REST application (/predict, /model-info, /batch-predict, /health)
│   ├── requirements.txt  # Python backend dependencies
│   └── smoke_test.py     # Inference and unit validation test suite
│
├── package.json          # Root monorepo build scripts for Vercel deployment
├── vercel.json           # Vercel deployment and routing configuration
└── README.md             # Master platform documentation
```

---

## Core Operational Capabilities

### 1. Multi-Branch Force Adaptation (`frontend/lib/force-metadata.ts`)
The platform dynamically shifts terminology, battalion structures, ranks, and operational benchmarks for:
* **CRPF (Central Reserve Police Force)**: Motto *"Service and Loyalty / सेवा और निष्ठा"* • LWE Counter-Insurgency.
* **Indian Army**: Motto *"Service Before Self / सेवा परमो धर्मः"* • High-Altitude Warfare (Siachen / Leh / Eastern Ladakh).
* **BSF (Border Security Force)**: Motto *"Duty Unto Death / जीवन पर्यन्त कर्तव्य"* • International Border Outposts (BOPs).
* **ITBP (Indo-Tibetan Border Police)**: Motto *"Valour - Steadfastness - Commitment / शौर्य - दृढ़ता - कर्म निष्ठा"* • Himalayan High Altitude.
* **CISF (Central Industrial Security Force)**: Motto *"Protection and Security / संरक्षण एवं सुरक्षा"* • Critical Infrastructure & Aviation Security.
* **State Police**: Motto *"सद्रक्षणाय खलनिग्रहणाय"* • Law & Order, 14-Hour Bandobast, and PCR Operations.

### 2. The Buddy-Pair System (बडी-पेयर / साथी कल्याण प्रणाली)
Built on authentic Armed Forces and CAPF doctrine where soldiers are paired with a "Buddy":
* Jawans have a confidential 1-tap peer wellness check:
  * *"मेरा साथी सुरक्षित एवं ठीक है (My Buddy is Good & Safe)"*
  * *"साथी को विश्राम / सहायता की आवश्यकता है (Buddy Needs Rest / Care)"* — confidentially alerts the Medical/Welfare Officer without negative service records.

### 3. Direct Sainik Sammelan & Confidential Darbar Request
Jawans can request a confidential 1-on-1 audience with their **Commanding Officer (CO)** or **Subedar Major (SM)** without middleman administrative filtering.

### 4. Leave & High-Altitude Decompression Tracker
* Tracks continuous days in forward operational deployments (e.g. 142 continuous field days).
* Computes Annual Leave balance quotas.
* Proactively recommends rotational decompression leave before acute burnout occurs.

### 5. Battalion Command & Control Roll-Call Grid
Commanders and Superintendents of Police (SPs) view live readiness heatmaps across **Alpha Coy, Bravo Coy, Charlie Coy, Delta Coy, and HQ Coy** with strictly anonymized PII.

---

## Ethical AI & DPDP Act 2023 Compliance

| Feature | Personnel (Jawan) | Welfare Officer (Doctor) | Commander (CO) |
| :--- | :---: | :---: | :---: |
| **Voluntary Self-Assessments** | Full Access | Clinical Care Only | Strictly Blocked |
| **Counseling & Therapy Notes** | Private | Doctor-Patient Only | Strictly Blocked |
| **Unit Aggregated Readiness** | Not Applicable | Aggregated | Aggregated & Masked |
| **ACR / APAR Performance Protection** | Guaranteed | Guaranteed | Guaranteed (Non-Punitive) |

* **Zero-Stigmatization Guarantee**: Disclosures never impact Annual Confidential Reports (ACR) or Annual Performance Appraisals (APAR).
* **Cryptographic Audit Trail**: Immutable access logs stored and verifiable in `/audit`.
* **National Helplines**: Directly linked to **Tele-MANAS (`14416`)** and **KIRAN (`1800-599-0019`)**.

---

## Machine Learning & AI Engine

* **Model Type**: Multi-Class Gradient Boosted Decision Tree (LightGBM).
* **Calibrated Performance**:
  * Raw Accuracy: 77.9%
  * Balanced Accuracy: 78.4%
  * Macro F1-Score: 0.773
  * Target Accuracy Range: 70% to 85% (calibrated against overfitting to model real-world biological fatigue transitions).
* **Explainability**: Integrated SHAP TreeExplainer ranking Top-3 stress drivers per evaluation.
* **Anti-Masking Guardrail**: Detects symptom suppression and false bravado by cross-referencing survey latency (<15s) with resting heart rate elevation.

---

## Getting Started

### 1. Run the Production Frontend (`frontend/`)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Test Production Build:
```bash
cd frontend
npm run build
```

---

### 2. Run the AI Inference Engine (`ai-engine/`)

```bash
# Navigate to the ai-engine directory
cd ai-engine

# Optional: Create and activate a Python virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI microservice
python main.py
```

* API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
* Health Check: [http://localhost:8000/health](http://localhost:8000/health)
* Model Telemetry: [http://localhost:8000/model-info](http://localhost:8000/model-info)

---

## Deploy to Vercel

To deploy the platform to Vercel:

1. Import your GitHub repository `https://github.com/Pk1823/Codecatalyst.git` into [Vercel](https://vercel.com).
2. The repository includes root `vercel.json` and `package.json` configurations for automatic monorepo builds.
3. Framework Preset: **Next.js**
4. Click **Deploy**.

---

## Key Route Index

| Route | Purpose | Target Role |
| :--- | :--- | :--- |
| `/` | Public Doctrine Portal with Branch Adaptation | All Visitors |
| `/login` | Credential-Based Sign In with Service ID & Passcode | Authenticated Users |
| `/personnel` | Jawan Wellbeing, Buddy-Pair Watch & Duty Log | Personnel / Jawan |
| `/personnel/wellness` | 7-Step Voluntary Stress & Health Assessment | Personnel / Jawan |
| `/personnel/support` | Confidential Welfare Support Request | Personnel / Jawan |
| `/personnel/privacy` | DPDP 2023 Consent Controls & Privacy Settings | Personnel / Jawan |
| `/welfare` | Welfare Command Hub, Active Cases & Rotations | Welfare Officer |
| `/welfare/cases` | Comprehensive Active Welfare Cases & Timelines | Welfare Officer |
| `/analytics` | Predictive Risk Distribution & SHAP Factor Impact | Welfare Officer |
| `/commander` | Force Overview & Battalion Company Roll-Call Grid | Battalion Commander |
| `/interventions` | Workload Reassignments & Rest Stand-down Tracker | Welfare Officer |
| `/recommendations` | AI Decision Support Engine for Roster Fair-Balance | Welfare Officer |
| `/audit` | Cryptographic Zero-Trust Access & Policy Log | System Administrator |
| `/privacy` | Data Minimization & Privacy Protection Center | All Roles |
| `/settings` | System & Profile Configuration | All Roles |

---

## Submission Details

* **Team:** Codecatalyst
* **Hackathon:** Smart India Hackathon (SIH)
* **Problem Statement:** 26186
* **Organization:** Central Reserve Police Force (CRPF) / Police II Division, Ministry of Home Affairs (MHA)

---

## Disclaimer

MissionWell AI provides predictive welfare indicators for authorized support personnel. It does **NOT** provide clinical medical diagnoses or automated disciplinary decisions. Personal disclosures are protected under strict medical privacy standards and the Digital Personal Data Protection (DPDP) Act 2023.
