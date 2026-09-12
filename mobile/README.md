# MissionWell AI Mobile Application (Sentinel of Resilience)

Cross-platform mobile application for **MissionWell AI**, engineered for defense and paramilitary forces (Indian Army, CRPF, BSF, ITBP, CISF, State Police).

---

## 📱 Features

- **Role-Based Experience**:
  - **Jawan / Field Personnel**: 1-Tap Daily Wellness Check, Anti-Masking Latency Guardrail, Buddy-Pair Check-in (*"मेरा साथी सुरक्षित है"*), and Confidential CO / SM Darbar requests.
  - **Welfare Officer (Doctor)**: Clinical triage queue, High/Medium/Low priority filtering, confidential doctor notes, and case status management.
  - **Battalion Commander (CO)**: Overall force readiness index, company-wise anonymized stress heatmaps, and Darbar request approvals.
  - **Tactical Alerts**: High-priority check-in reminders and push notifications.
  - **Force Customization & Settings**: Multi-branch support (CRPF, BSF, ITBP, Army, CISF, State Police) and tactical Night-Vision military dark mode.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Expo Development Server
```bash
npm run dev:mobile
# or inside mobile/:
cd mobile && npm start
```

### 3. Open on Your Device
- **Physical Phone**: Scan the displayed QR code with the **Expo Go** app (iOS Camera or Android Expo Go).
- **iOS Simulator**: Press `i` in the terminal.
- **Android Emulator**: Press `a` in the terminal.
- **Web Preview**: Press `w` in the terminal.

---

## 🌐 Separate Standalone Deployment

The mobile application can be deployed completely independently from the web portal through two primary pathways:

### Option 1: Standalone Mobile Web / PWA Deployment (Vercel)
A dedicated [`mobile/vercel.json`](file:///Users/akash/MissionWell-AI/Codecatalyst/mobile/vercel.json) configuration is included.
1. **Via Vercel CLI**:
   ```bash
   cd mobile
   npx vercel --prod
   ```
2. **Via Vercel Dashboard**:
   - Create a New Project importing this repository.
   - Set **Root Directory** to `mobile`.
   - **Build Command**: `npx expo export -p web` (or `npm run build`).
   - **Output Directory**: `dist`.
   - Add environment variable `EXPO_PUBLIC_BACKEND_URL` pointing to your deployed backend.

### Option 2: Standalone Native Android APK & iOS Build (EAS)
A dedicated [`mobile/eas.json`](file:///Users/akash/MissionWell-AI/Codecatalyst/mobile/eas.json) configuration is provided for building installable packages:
1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Generate Standalone Android `.apk`** (direct download & install for soldiers/judges):
   ```bash
   cd mobile
   eas build -p android --profile preview
   ```
3. **Production App Store / Google Play Bundle**:
   ```bash
   cd mobile
   eas build --profile production
   ```

---

## 🛡️ Statutory Privacy (DPDP Act 2023)
- Fully zero-stigmatization compliant.
- Personnel self-assessments are strictly blocked from ACR/APAR appraisals.
- Commanders only receive company-level aggregated and anonymized readiness scores.
