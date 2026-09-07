# MissionWell AI

> **Predictive Wellness Monitoring for Safer, Stronger Forces**  
> *Smart India Hackathon Problem Statement 26186 (CRPF / Police II Division / Ministry of Home Affairs)*

---

## 🎖️ Overview

**MissionWell AI** is an AI-powered, privacy-first personnel welfare intelligence system designed for Central Armed Police Forces (CAPFs) and Uniformed Services. It identifies early indicators of operational stress, burnout, and fatigue through non-intrusive duty rosters, leave patterns, and voluntary wellness self-assessments, enabling timely, confidential welfare support.

> *"Personnel wellbeing is mission readiness."*

---

## 🚀 Key Features

* **Government-Grade UI/UX:** Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.
* **Role-Based Access Control (RBAC):**
  * **Personnel Portal (`/personnel`):** Self-reporting wellness assessments, personal trend lines, and confidential support requests.
  * **Welfare Officer Command (`/welfare`):** Sector risk distribution, active welfare alerts, interactive case management, and rotational duty planning.
  * **Commander Overview (`/commander`):** Force-level aggregated readiness telemetry with zero individual PII exposure.
  * **System Administration (`/admin`):** Identity policies and cryptographic audit logs.
* **Explainable AI (XAI):** Transparent factor attribution (Deployment duration, Duty hours, Sleep deficit, Leave underutilization) powered by predictive machine learning models.
* **Zero-Trust Privacy & DPDP Act 2023 Compliance:** Strict role visibility separation, automated 90-day purge cycles, differential mathematical salting, and non-punitive legal covenants.
* **Judge Pitch Presentation Mode (`/presentation`):** Fullscreen interactive slide deck for live demonstrations.

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, React Hook Form, Zod, TanStack Query
* **AI Engine:** Python, FastAPI, LightGBM (`ai-engine/`)

---

## 🏃 Getting Started

### 1. Run the Frontend

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run the AI Engine (Optional)

```bash
cd ai-engine
pip install -r requirements.txt
python main.py
```

---

## 🌐 Deploy to Vercel

Click below or import your GitHub repository directly into [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPk1823%2FCodecatalyst)

---

## 📄 License & Disclaimer

MissionWell AI provides predictive welfare indicators for authorized support personnel. It does NOT provide medical diagnoses or automated disciplinary decisions.
