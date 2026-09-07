<div align="center">

# 🇮🇳 MissionWell AI (Sentinel of Resilience)
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

## 📌 Executive Summary

**MissionWell AI** is a state-of-the-art, government-grade predictive wellness intelligence platform engineered specifically for **the Indian Army, Central Armed Police Forces (CRPF, BSF, ITBP, CISF), and State Police forces**. 

In high-stress operational environments—such as Counter-Insurgency grids in Bastar/Sukma, extreme High-Altitude snow-bound forward posts in Siachen/Ladakh (-35°C), remote Border Outposts (BOPs) in the Thar Desert, or grueling 14-hour law-and-order bandobast duties—personnel face cumulative operational fatigue, sleep deprivation, and separation from families.

Traditional welfare methods are reactive, waiting for acute breakdown or formal grievances. **MissionWell AI** transforms welfare into an **evidence-based, proactive continuum** that flags early fatigue and burnout without medical jargon, stigmatization, or career penalty.

---

## 🏛️ Repository Architecture

This repository is cleanly separated into two distinct components alongside the legacy single-file demonstrator:

```
Codecatalyst/
├── frontend/             # Production Next.js 16 App Router frontend (React 19, TypeScript, Tailwind)
│   ├── app/              # 21 Complete Routes (Landing, Login, Personnel, Welfare, Commander, Analytics, etc.)
│   ├── components/       # UI components, layout bars, Recharts widgets, Authority Dock
│   ├── lib/              # Force metadata, mock datasets, utility helpers
│   ├── services/         # Decoupled frontend API service layers
│   ├── types/            # Strict TypeScript interfaces
│   ├── package.json      # Frontend package configuration
│   └── tsconfig.json     # TypeScript strict configuration
│
├── ai-engine/            # Python FastAPI microservice with trained LightGBM ML model
│   ├── models/           # defense_stress_lgbm_model.joblib
│   ├── notebooks/        # Model training pipelines
│   ├── src/              # Feature engineering & StressPredictor class with SHAP attribution
│   ├── main.py           # FastAPI REST application (/predict, /health)
│   ├── requirements.txt  # Python backend dependencies
│   └── smoke_test.py     # Inference validation test
│
├── index2.html           # Legacy standalone single-file frontend demonstration
└── README.md             # Master platform documentation
```

---

## 🎖️ Core Authentic Military & Police Capabilities

### 1. 🇮🇳 6 Uniformed Services Adaptation (`frontend/lib/force-metadata.ts`)
The platform dynamically shifts terminology, battalion structures, ranks, and operational benchmarks for:
* **CRPF (केन्द्रीय रिजर्व पुलिस बल)**: Motto *"Service and Loyalty / सेवा और निष्ठा"* • LWE Counter-Insurgency (Bastar/Dantewada).
* **Indian Army (भारतीय थल सेना)**: Motto *"Service Before Self / सेवा परमो धर्मः"* • High-Altitude Warfare (Siachen / Leh / Eastern Ladakh).
* **BSF (सीमा सुरक्षा बल)**: Motto *"Duty Unto Death / जीवन पर्यन्त कर्तव्य"* • International Border Outposts (BOP Ranian / Thar Desert).
* **ITBP (भारत-तिब्बत सीमा पुलिस)**: Motto *"Valour - Steadfastness - Commitment / शौर्य - दृढ़ता - कर्म निष्ठा"* • Himalayan Snow Line (-35°C).
* **CISF (केन्द्रीय औद्योगिक सुरक्षा बल)**: Motto *"Protection and Security / संरक्षण एवं सुरक्षा"* • Critical Infrastructure & Aviation Security.
* **State Police (राज्य पुलिस बल)**: Motto *"सद्रक्षणाय खलनिग्रहणाय"* • Law & Order, 14-Hour Bandobast, and PCR Operations.

### 2. 🤝 The Sacred Buddy-Pair System (बडी-पेयर / साथी कल्याण प्रणाली)
Built on authentic Armed Forces & CAPF doctrine where soldiers are paired with a "Buddy" (जोड़ीदार):
* Jawans have a confidential 1-tap peer wellness check:
  * *"मेरा साथी सुरक्षित एवं ठीक है (My Buddy is Good & Safe)"*
  * *"साथी को विश्राम / सहायता की आवश्यकता है (Buddy Needs Rest / Care)"* — confidentially alerts the Medical/Welfare Officer without negative service records.

### 3. 🎖️ Direct Sainik Sammelan & Confidential Darbar Request
Jawans can request a confidential 1-on-1 audience with their **Commanding Officer (CO)** or **Subedar Major (SM)** without middleman administrative filtering.

### 4. 🏕️ Leave & High-Altitude Decompression Tracker
* Tracks continuous days in hard area forward posts (e.g. 142 days continuous duty).
* Computes Annual Leave quota balance (48/60 days remaining).
* Proactively recommends rotational decompression leave before acute burnout occurs.

### 5. 🛡️ Battalion Command & Control Roll-Call Grid
Commanders and Superintendents of Police (SPs) view live readiness heatmaps across **Alpha Coy, Bravo Coy, Charlie Coy, Delta Coy, and HQ Coy** with strictly masked PII.

### 6. ⚡ 1-Click Floating Authority Dock (`components/layout/authority-bar.tsx`)
Designed for hackathon judges and visiting authorities to evaluate the system with **one tap**:
* 🎖️ **जवान / आरक्षक (Personnel View)**: Ct. Piyush Kumar / Sepoy Amit Thapa
* 🩺 **कल्याण अधिकारी (Welfare Officer View)**: Dr. Aarti Sharma (Deputy Commandant / CMO)
* 🛡️ **कमांडेंट / पुलिस अधीक्षक (Commander View)**: Col. Rajeshwar Singh (Commanding Officer)
* ⚖️ **सिस्टम प्रशासक (Admin & Audit View)**: Sunil Patel (Senior Systems Officer, NIC/MHA)
* 🌐 **Bilingual Toggle (EN / हिन्दी)**: Instant language switch across all screens.

---

## 🔒 Ethical AI & DPDP Act 2023 Compliance

| Feature | Personnel (जवान) | Welfare Officer (डॉक्टर) | Commander (कमांडेंट) |
| :--- | :---: | :---: | :---: |
| **Voluntary Self-Assessments** | Full Access | Clinical Care Only | ❌ **Strictly Blocked** |
| **Counseling & Therapy Notes** | Private | Doctor-Patient Only | ❌ **Strictly Blocked** |
| **Unit Aggregated Readiness** | — | Aggregated | ✓ **Aggregated & Masked** |
| **ACR / Performance Protection** | **Guaranteed** | **Guaranteed** | **Guaranteed (Non-Punitive)** |

* **Zero-Stigmatization Guarantee**: Disclosures never impact Annual Confidential Reports (ACR) or Annual Performance Appraisals (APAR).
* **Cryptographic Audit Trail**: Immutable access logs stored and verifiable in `/audit`.
* **National Helplines**: Directly linked to **Tele-MANAS (`14416`)** and **KIRAN (`1800-599-0019`)**.

---

## 🚀 Getting Started

### Option 1: Run the Production Frontend (`frontend/`)

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Test Production Build:
```bash
cd frontend
npm run build
```
*(Compiles all 21 static and dynamic routes with 0 errors)*

---

### Option 2: Run the AI Inference Engine (`ai-engine/`)

```bash
# 1. Navigate to the ai-engine directory
cd ai-engine

# 2. (Optional) Create and activate a Python virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install requirements
pip install -r requirements.txt

# 4. Start the FastAPI microservice
python main.py
# Or using uvicorn directly:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

* API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
* Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### Option 3: View the Standalone Legacy Frontend

Simply open [index2.html](file:///d:/HACKTHON/Codecatalyst/MW/index2.html) directly in any modern web browser.

---

## 🌐 Deploy to Vercel

To deploy the **Next.js Frontend** to Vercel:

1. Import your GitHub repository `https://github.com/Pk1823/Codecatalyst.git` into [Vercel](https://vercel.com).
2. In the Vercel Project Settings, set the **Root Directory** to:
   ```
   frontend
   ```
3. Framework Preset: **Next.js**
4. Build Command: `npm run build`
5. Click **Deploy**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPk1823%2FCodecatalyst&root-directory=frontend)

---

## 📊 Key Route Index

| Route | Purpose | Target User |
| :--- | :--- | :--- |
| `/` | Public Ministry Portal with Force Switcher & Authority Testing | All Visitors & Evaluators |
| `/login` | Service ID + Sandes OTP Simulation & 1-Click Personas | Evaluators & Personnel |
| `/personnel` | Jawan Wellbeing, Buddy-Pair Watch & Leave Decompression | Jawan / Constable |
| `/personnel/wellness` | 7-Step Voluntary Psychological & Stress Assessment | Jawan / Constable |
| `/personnel/support` | Confidential Welfare Support & MI Room Request | Jawan / Constable |
| `/welfare` | Welfare Command Hub, Active Cases & Rotations | Welfare Officer / Medical Officer |
| `/welfare/cases` | Comprehensive Active Welfare Cases & Timelines | Welfare Officer |
| `/analytics` | Predictive Risk Distribution & Explainable AI Drivers | Welfare Officer |
| `/commander` | Force Overview, Battalion Company Roll-Call Stress Grid | Battalion Commander / SP |
| `/interventions` | Workload Reassignments & Rest Stand-down Tracker | Welfare & Operations Cell |
| `/recommendations` | AI Decision Support Engine for Roster Fair-Balance | Welfare Officer |
| `/presentation` | Fullscreen Interactive Pitch Deck for Judges | SIH Evaluation Committee |
| `/audit` | Cryptographic Zero-Trust Access & Policy Log | System Administrator / MHA |

---

## 📜 Team & Hackathon Submission

* **Team:** Codecatalyst
* **Hackathon:** Smart India Hackathon (SIH)
* **Problem Statement:** 26186
* **Organization:** Central Reserve Police Force (CRPF) / Police II Division, Ministry of Home Affairs (MHA)

---

## ⚖️ Disclaimer

MissionWell AI provides predictive welfare indicators for authorized support personnel. It does **NOT** provide clinical medical diagnoses or automated disciplinary decisions. Personal disclosures are protected under strict medical privacy standards and the Digital Personal Data Protection (DPDP) Act 2023.
