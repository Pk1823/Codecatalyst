"""
Google Gemini API Integration for Defense Personnel Stress & Welfare Monitoring System.
Provides AI risk synthesis, contextual SHAP explanations, and non-punitive welfare recommendations.
"""

import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class GeminiService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.client = None
        self.model_name = "gemini-2.5-flash"
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            print("[!] GeminiService: GEMINI_API_KEY not configured. Running in deterministic fallback mode.")
            return

        try:
            # Try new google-genai SDK first
            from google import genai
            self.client = genai.Client(api_key=self.api_key)
            self.sdk_type = "google-genai"
            print("[+] GeminiService initialized with google-genai SDK.")
        except Exception as e:
            try:
                # Fallback to google.generativeai if available
                import google.generativeai as genai_legacy
                genai_legacy.configure(api_key=self.api_key)
                self.client = genai_legacy.GenerativeModel("gemini-1.5-flash")
                self.sdk_type = "google-generativeai"
                print("[+] GeminiService initialized with google-generativeai legacy SDK.")
            except Exception as e2:
                print(f"[!] GeminiService initialization error: {e2}. Falling back to rule-based engine.")
                self.client = None

    def is_active(self) -> bool:
        return self.client is not None

    def synthesize_risk_narrative(
        self,
        telemetry: Dict[str, Any],
        risk_band: str,
        alert_priority: str,
        top_drivers: List[Dict[str, Any]],
        masking_detected: bool
    ) -> str:
        """
        Synthesizes an officer/medic-ready natural language risk assessment explaining
        compound stress factors and anti-masking indicators.
        """
        if not self.is_active():
            return self._fallback_narrative(risk_band, top_drivers, masking_detected)

        drivers_summary = ", ".join(
            f"{d['description']} ({d['feature']} = {d['value']})" for d in top_drivers
        )

        prompt = f"""You are a specialized AI Defense Welfare & Operational Readiness Specialist analyzing personnel telemetry.

Personnel Context:
- Risk Band: {risk_band}
- Alert Priority: {alert_priority}
- Consecutive Field Days: {telemetry.get('consecutive_field_days', 0)}
- 5-Day Duty Hours: {telemetry.get('duty_hours_5d', 0)}
- 5-Day Night Shifts: {telemetry.get('night_shifts_5d', 0)}
- Leave Denial Ratio: {telemetry.get('leave_denial_ratio', 0.0)}
- 5-Day Avg Sleep (hrs): {telemetry.get('sleep_hrs_5d_avg', 0.0)}
- Self-Reported Stress (1-10): {telemetry.get('self_reported_stress', 0)}
- Self-Reported Energy (1-5): {telemetry.get('self_reported_energy', 0)}
- Resting Heart Rate Delta (bpm): {telemetry.get('delta_rhr', 0.0)}
- Anti-Masking Triggered: {'YES (Possible stress suppression under high duty tempo)' if masking_detected else 'NO'}
- Top SHAP Stress Drivers: {drivers_summary}

Task: Write a concise, professional 2-3 sentence executive risk summary for unit medical officers and commanders. 
Focus on:
1. Identifying the core root drivers behind the risk assessment.
2. Highlighting any physiological or behavioral anomalies (e.g. sleep debt, leave backlog, or masking).
3. Maintaining a supportive, non-punitive military welfare perspective.

Response (keep it direct, professional, max 80 words):"""

        try:
            if getattr(self, "sdk_type", "") == "google-genai":
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                return response.text.strip()
            elif getattr(self, "sdk_type", "") == "google-generativeai":
                response = self.client.generate_content(prompt)
                return response.text.strip()
        except Exception as e:
            print(f"[!] Gemini API narrative generation error: {e}")
            # Try alternate fallback model if 2.5-flash model name had issue
            try:
                if getattr(self, "sdk_type", "") == "google-genai":
                    response = self.client.models.generate_content(
                        model="gemini-1.5-flash",
                        contents=prompt
                    )
                    return response.text.strip()
            except Exception:
                pass

        return self._fallback_narrative(risk_band, top_drivers, masking_detected)

    def generate_enhanced_guidance(
        self,
        telemetry: Dict[str, Any],
        risk_band: str,
        top_drivers: List[Dict[str, Any]],
        masking_detected: bool,
        rule_guidance: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        """
        Enhances rule-based recommendations into empathetic, role-specific actionable interventions.
        """
        if not self.is_active():
            return rule_guidance

        prompt = f"""You are an expert military mental health and operational welfare advisor.

Given personnel risk evaluation:
- Risk Band: {risk_band}
- Masking Discrepancy Flag: {masking_detected}
- Primary Stress Drivers: {', '.join([d['description'] for d in top_drivers])}
- Sleep Avg: {telemetry.get('sleep_hrs_5d_avg')}h, Duty Hours 5d: {telemetry.get('duty_hours_5d')}h, Field Days: {telemetry.get('consecutive_field_days')}d

Rule-Based Recommendations:
{rule_guidance}

Task: Enhance these recommendations into 2-4 highly actionable, supportive, non-punitive military welfare recommendations.
Format output strictly as a JSON array of objects with keys: "code", "recommendation".
Example:
[
  {{"code": "REST_CYCLE_STABILIZATION", "recommendation": "Grant a structured 24-hour sleep restoration window prior to next operational watch."}},
  {{"code": "BUDDY_SYSTEM_CHECK", "recommendation": "Assign an informal peer buddy check-in without formal disciplinary log entry."}}
]
JSON Output:"""

        try:
            import json
            import re

            raw_text = ""
            if getattr(self, "sdk_type", "") == "google-genai":
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                raw_text = response.text.strip()
            elif getattr(self, "sdk_type", "") == "google-generativeai":
                response = self.client.generate_content(prompt)
                raw_text = response.text.strip()

            json_match = re.search(r'\[.*\]', raw_text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group(0))
                if isinstance(parsed, list) and len(parsed) > 0:
                    return parsed
        except Exception as e:
            print(f"[!] Gemini guidance enhancement error: {e}")

        return rule_guidance

    def _fallback_narrative(self, risk_band: str, top_drivers: List[Dict[str, Any]], masking_detected: bool) -> str:
        drivers_text = ", ".join([d['description'] for d in top_drivers[:2]]) if top_drivers else "operational strain"
        if masking_detected:
            return f"Personnel evaluated at {risk_band} risk band with potential behavioral stress suppression detected. Primary contributing factors include {drivers_text}. Peer buddy check-in and discreet welfare observation are recommended."
        elif risk_band == "HIGH":
            return f"High operational stress detected driven primarily by {drivers_text}. Immediate non-punitive duty rotation and circadian recovery stand-down recommended."
        elif risk_band == "MODERATE":
            return f"Moderate stress accumulation noted due to {drivers_text}. Routine monitoring and workload pacing advised to maintain operational readiness."
        else:
            return "Personnel telemetry reflects stable operational readiness within baseline limits. Standard routine monitoring recommended."
