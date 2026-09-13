#!/usr/bin/env node
/**
 * MissionWell AI — Firebase Hosting Automated Deployment Script
 * Usage:
 *   node scripts/deploy-firebase.js [optional-project-id]
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const mobileDir = path.join(rootDir, "mobile");

console.log("\n=======================================================");
console.log("🚀 MISSIONWELL AI — FIREBASE HOSTING DEPLOYMENT ENGINE");
console.log("=======================================================\n");

// 1. Export Web Build
console.log("📦 1/3 Building Mobile Expo Web Production Bundle...");
try {
  execSync("npx expo export -p web", { cwd: mobileDir, stdio: "inherit" });
  console.log("✅ Web bundle generated successfully in mobile/dist\n");
} catch (err) {
  console.error("❌ Failed to build web bundle:", err.message);
  process.exit(1);
}

// 2. Determine Project ID
let projectId = process.argv[2];
if (!projectId) {
  const rcPath = path.join(rootDir, ".firebaserc");
  if (fs.existsSync(rcPath)) {
    try {
      const rc = JSON.parse(fs.readFileSync(rcPath, "utf8"));
      projectId = rc.projects?.default;
    } catch {}
  }
}

// 3. Deploy
console.log("🌐 2/3 Deploying to Firebase Hosting...");
const deployCmd = projectId
  ? `npx -y firebase-tools@latest deploy --only hosting --project ${projectId}`
  : `npx -y firebase-tools@latest deploy --only hosting`;

try {
  execSync(deployCmd, { cwd: rootDir, stdio: "inherit" });
  console.log("\n✨ 3/3 DEPLOYMENT COMPLETE!");
  console.log("🎉 MissionWell AI Mobile Web App is now live on Firebase Hosting!\n");
} catch (err) {
  console.log("\n⚠️ Firebase requires login if you are not yet authenticated.");
  console.log("👉 Please run: npx -y firebase-tools@latest login");
  console.log("👉 Then re-run: npm run deploy:firebase\n");
}
