# SIH JUDGE PRESENTATION & DEFENSE Q&A GUIDE

## 1. ELEVATOR PITCH & PROBLEM OVERVIEW

### Q1: 60-Second Elevator Pitch
- **What It Is**: Defense-grade predictive welfare & operational readiness platform for Indian Armed Forces and CAPF (CRPF, BSF, ITBP, CISF, SSB, AR).
- **Core Innovation**: Replaces reactive welfare with proactive early-warning intelligence using LightGBM AI & SHAP explainability.
- **Privacy Shield**: 100% DPDP Act 2023 compliant — zero ACR/APAR career prejudice.

### Q2: What exact problem does this solve for MHA?
- **Current Gap**: 14-hr continuous duties, extreme deployment (-35°C Siachen, LWE Bastar), and sleep debt. Existing checkups are reactive; Jawans suppress stress out of career fear.
- **Solution**: Delivers early risk indicators to Welfare Doctors while providing anonymized, aggregate readiness heatmaps to Commanders.

---

## 2. SYSTEM ARCHITECTURE & TECH STACK

### Q3: Overall System Architecture
- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS) with `#090D16` military night-vision mode.
- **Backend API**: Node.js Express (TypeScript, Prisma ORM, Jose JWT auth, SHA-256 audit logging).
- **AI Microservice**: Python FastAPI (Port 8000) running LightGBM & SHAP TreeExplainer (<15ms latency).
- **Database**: SQLite (`dev.db`) for evaluation / PostgreSQL for production.

### Q4: Why separate the Python ML microservice from Node.js?
- **Independent Scaling**: ML engine scales horizontally during surge assessments without impacting web traffic.
- **Ecosystem Standard**: Python provides native support for LightGBM, SHAP, and NumPy.
- **Low Latency**: FastAPI async execution returns predictions in under 15ms.

### Q5: Multi-Branch Force Customization
- Dynamic adaptation of mottos, rank structures, badges, and terminology across **CRPF, Indian Army, BSF, ITBP, CISF, and State Police**.

---

## 3. MACHINE LEARNING & EXPLAINABLE AI (XAI)

### Q6: Why LightGBM instead of Deep Learning or Logistic Regression?
- **Tabular Data Superiority**: Gradient Boosted Trees outperform neural networks on tabular physiological/duty telemetry.
- **Efficiency**: Handles complex non-linear feature interactions without GPU requirements.
- **Native XAI**: Direct support for exact SHAP `TreeExplainer` attribution.

### Q7: Model Performance Metrics (77.9% Raw, 78.4% Balanced, F1 0.773)
- **Calibrated Precision**: Deliberately calibrated to model real-world physiological stress transitions.
- **No Overfitting**: 99% accuracy on clinical data indicates data leakage; 78% balanced accuracy guarantees reliable, un-inflated real-world risk detection.

### Q8: SHAP Feature Attribution
- **Targeted Insights**: Breaks down risk scores into exact drivers (e.g. +32 pts Sleep Debt, +24 pts Continuous Deployment, +15 pts Leave Denial).
- **Actionable Care**: Enables doctors to prescribe targeted duty rotations instead of generic advice.

### Q9: Anti-Symptom-Masking Guardrail
- **False-Bravado Detection**: Flags surveys completed in <15 seconds when baseline resting heart rate or duty hours are elevated.

---

## 4. DPDP ACT 2023 COMPLIANCE & PRIVACY

### Q10: DPDP Act 2023 & Zero ACR/APAR Damage
- **Commander Isolation**: Individual survey responses and clinical notes return `HTTP 403 Forbidden` to Commander accounts.
- **Anonymized Command View**: Commanders see only battalion-level aggregate heatmaps.
- **Audit Ledger**: Every query is logged with SHA-256 hashes for System Admin auditing.

### Role Access Matrix
- **Personnel (Jawan)**: Own profile & self-care only.
- **Welfare Officer (Doctor)**: Assigned clinical dossiers & triage notes.
- **Commander (CO)**: Anonymized battalion heatmaps only (**Individual PII Blocked**).
- **System Admin**: System audit & health logs only.

---

## 5. UNIQUE DOMAIN FEATURES

### Q11: Buddy-Pair System (बडी-पेयर)
- 1-tap confidential peer check-in (*"साथी को विश्राम / सहायता की आवश्यकता है"*) to support buddies in high-stress zones.

### Q12: Confidential Digital Sainik Darbar
- Direct digital request routing to bypass multi-tier rank hierarchy friction.

---

## 6. TOUGH JUDGES' CORNER (TRICKY QUESTIONS & ANSWERS)

### Q13: Remote / Zero-Connectivity Deployment (Siachen / Thar BOP)?
- **Answer**: Offline-first PWA architecture with local SQLite storage. Telemetry syncs in encrypted batches when network connectivity is restored.

### Q14: What if a Commander demands individual mental health scores?
- **Answer**: Enforced `HTTP 403 Forbidden` at backend API level under DPDP Act Section 8(4). CO gets unit-level operational relief metrics only.

### Q15: Does this replace military psychiatrists?
- **Answer**: No. It is a decision-support early-triaging tool that maximizes the efficiency and reach of limited medical personnel.

### Q16: System Scalability across 10 Lakh CAPF Personnel?
- **Answer**: Stateless Node.js containers, PostgreSQL database indexing, and lightweight LightGBM microservice (~15ms response) ready for Kubernetes cluster deployment.

---

## 7. RECOMMENDED LIVE DEMO FLOW

1. **Google OAuth Login**: Select evaluator role (Doctor / Commander / Jawan).
2. **Jawan Assessment**: Complete assessment -> Trigger LightGBM score & SHAP drivers.
3. **Welfare Triage**: Doctor views confidential case & adds clinical notes.
4. **Commander View**: View anonymized battalion heatmap & download official MHA report.
