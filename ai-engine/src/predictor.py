"""
Core Inference Engine with Guardrails and Explainability for Defense Personnel Welfare System.
"""

import os
import joblib
import numpy as np
import pandas as pd
import shap
from typing import Dict, Any, List, Optional

FEATURE_COLUMNS = [
    'consecutive_field_days',
    'duty_hours_5d',
    'night_shifts_5d',
    'leave_denial_ratio',
    'sleep_hrs_5d_avg',
    'self_reported_energy',
    'self_reported_stress',
    'survey_latency_sec',
    'delta_rhr',
    'masking_index'
]

# Human-friendly descriptions and guidance mappings for features
FEATURE_DESCRIPTIONS = {
    'consecutive_field_days': "High operational deployment duration without base rotation",
    'duty_hours_5d': "Excessive working/duty hours accrued over past 5 days",
    'night_shifts_5d': "High frequency of overnight watches disrupting circadian rhythm",
    'leave_denial_ratio': "Elevated leave cancellation/rejection ratio causing home detachment stress",
    'sleep_hrs_5d_avg': "Critical sleep deprivation below restorative threshold",
    'self_reported_energy': "Subjective energy/vitality deficit",
    'self_reported_stress': "Subjective acute stress elevation",
    'survey_latency_sec': "Abnormally low survey response time indicative of hasty/superficial completion",
    'delta_rhr': "Elevated resting heart rate delta above personal baseline (sympathetic arousal)",
    'masking_index': "High behavioral masking score (macho culture / stress suppression tendency)"
}


class StressPredictor:
    """
    Production-grade predictor with dual calibrated probability thresholds,
    anti-masking guardrails, and SHAP explainability.
    """

    def __init__(self, model_path: Optional[str] = None):
        if model_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            model_path = os.path.join(base_dir, 'models', 'defense_stress_lgbm_model.joblib')

        self.model_path = model_path
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model artifact not found at '{self.model_path}'. "
                "Please run 'notebooks/train_model.py' first."
            )

        artifact = joblib.load(self.model_path)
        if isinstance(artifact, dict) and 'model' in artifact:
            self.model = artifact['model']
            self.feature_names = artifact.get('feature_names', FEATURE_COLUMNS)
            self.metadata = artifact.get('metrics', {})
        else:
            self.model = artifact
            self.feature_names = FEATURE_COLUMNS
            self.metadata = {}

        # Initialize TreeExplainer for fast exact Tree SHAP attributions
        self.explainer = shap.TreeExplainer(self.model)

    def predict(self, telemetry_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs calibrated inference on personnel telemetry.
        """
        # Prepare DataFrame with explicit feature ordering
        row_data = {feat: float(telemetry_dict.get(feat, 0.0)) for feat in self.feature_names}
        df_row = pd.DataFrame([row_data], columns=self.feature_names)

        # Predict multi-class probabilities: [P(Low), P(Moderate), P(High)]
        probabilities = self.model.predict_proba(df_row)[0]
        p_low, p_moderate, p_high = float(probabilities[0]), float(probabilities[1]), float(probabilities[2])

        confidence_scores = {
            "low": round(p_low, 4),
            "moderate": round(p_moderate, 4),
            "high": round(p_high, 4)
        }

        # Step 1: Calibrated Dual-Threshold Logic
        if p_high >= 0.65:
            risk_band = "HIGH"
            alert_priority = "URGENT"
        elif p_high >= 0.35 or p_moderate >= 0.50:
            risk_band = "MODERATE"
            alert_priority = "ROUTINE_MONITORING"
        else:
            risk_band = "LOW"
            alert_priority = "LOW_PRIORITY"

        # Step 2: Anti-Masking Heuristic Guardrail
        # In military/CAPF environments, personnel often suppress symptoms (macho culture).
        # Fast survey completion (<15s) paired with high discrepancy/masking index is an indicator.
        masking_index_val = float(telemetry_dict.get('masking_index', 0.0))
        survey_latency_val = float(telemetry_dict.get('survey_latency_sec', 0.0))

        masking_detected = (masking_index_val > 0.35) and (survey_latency_val < 15.0)

        if masking_detected:
            # Prevent False Negatives: Elevate priority for discreet wellness review
            if alert_priority != "URGENT":
                alert_priority = "DISCREET_CHECK"
            if risk_band == "LOW":
                risk_band = "POTENTIAL_MASKING"

        # Step 3: SHAP Feature Attributions
        top_drivers = self._extract_top_drivers(df_row, p_high, p_moderate)

        # Step 4: Structured Non-Punitive Clinical/Welfare Guidance
        guidance = self._generate_welfare_guidance(
            risk_band=risk_band,
            alert_priority=alert_priority,
            masking_detected=masking_detected,
            telemetry=telemetry_dict,
            top_drivers=top_drivers
        )

        return {
            "risk_band": risk_band,
            "alert_priority": alert_priority,
            "confidence_scores": confidence_scores,
            "masking_flag": bool(masking_detected),
            "top_drivers": top_drivers,
            "clinical_guidance": guidance
        }

    def _extract_top_drivers(self, df_row: pd.DataFrame, p_high: float, p_moderate: float) -> List[Dict[str, Any]]:
        """
        Extracts the top 3 feature drivers contributing to risk using SHAP.
        """
        shap_values = self.explainer.shap_values(df_row)

        # In shap multi-class, shap_values can be:
        # list of arrays (one per class [0, 1, 2]), or 3D numpy array (n_samples, n_features, n_classes)
        if isinstance(shap_values, list):
            # Target class 2 (High risk) or class 1 (Moderate) based on elevated risk
            target_class_idx = 2 if p_high >= p_moderate else (1 if p_moderate > 0.4 else 0)
            target_shap = shap_values[target_class_idx][0]
        elif isinstance(shap_values, np.ndarray):
            if shap_values.ndim == 3:
                target_class_idx = 2 if p_high >= p_moderate else (1 if p_moderate > 0.4 else 0)
                target_shap = shap_values[0, :, target_class_idx]
            elif shap_values.ndim == 2:
                target_shap = shap_values[0]
            else:
                target_shap = shap_values
        else:
            target_shap = np.zeros(len(self.feature_names))

        # Pair features with their attribution score and actual value
        driver_items = []
        for idx, feat_name in enumerate(self.feature_names):
            val = float(df_row.iloc[0, idx])
            shap_impact = float(target_shap[idx]) if idx < len(target_shap) else 0.0
            driver_items.append({
                "feature": feat_name,
                "value": round(val, 2),
                "importance": round(shap_impact, 4),
                "abs_importance": abs(shap_impact),
                "description": FEATURE_DESCRIPTIONS.get(feat_name, feat_name)
            })

        # Rank by magnitude of importance
        driver_items.sort(key=lambda x: x["abs_importance"], reverse=True)

        # Pick top 3
        top_3 = []
        for item in driver_items[:3]:
            top_3.append({
                "feature": item["feature"],
                "value": item["value"],
                "importance": item["importance"],
                "description": item["description"]
            })

        return top_3

    def _generate_welfare_guidance(
        self,
        risk_band: str,
        alert_priority: str,
        masking_detected: bool,
        telemetry: Dict[str, Any],
        top_drivers: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """
        Generates structured, non-punitive welfare recommendations tailored to specific stress drivers.
        """
        guidance: List[Dict[str, str]] = []

        sleep_hrs = float(telemetry.get('sleep_hrs_5d_avg', 7.0))
        field_days = float(telemetry.get('consecutive_field_days', 0.0))
        leave_denial = float(telemetry.get('leave_denial_ratio', 0.0))
        night_shifts = float(telemetry.get('night_shifts_5d', 0.0))
        delta_rhr = float(telemetry.get('delta_rhr', 0.0))

        # Anti-masking specific guidance
        if masking_detected:
            guidance.append({
                "code": "PEER_BUDDY_DISCREET_CHECK",
                "recommendation": "Deploy unit peer-support buddy for informal, confidential check-in without formal disciplinary or operational stigma."
            })

        # Sleep & Fatigue guidance
        if sleep_hrs < 5.0 or any(d['feature'] == 'sleep_hrs_5d_avg' for d in top_drivers):
            guidance.append({
                "code": "FATIGUE_MITIGATION_PROTOCOL",
                "recommendation": "Mandatory 24-hour sleep hygiene intervention and duty stand-down to restore cognitive baseline."
            })

        # Deployment & Leave rotation guidance
        if field_days > 45 or leave_denial > 0.4:
            guidance.append({
                "code": "LEAVE_ROTATION_PRIORITY",
                "recommendation": "Expedite rotation from high-tempo operational zone and prioritize pending home leave allocation."
            })

        # Circadian / Night shift guidance
        if night_shifts >= 3:
            guidance.append({
                "code": "CIRCADIAN_RHYTHM_RESET",
                "recommendation": "Rotate out of consecutive night watch duties to realign sleep-wake cycles."
            })

        # Physiological strain guidance
        if delta_rhr > 5.0:
            guidance.append({
                "code": "PHYSIOLOGICAL_BASELINE_REVIEW",
                "recommendation": "Refer to unit medical officer for non-invasive resting heart rate and autonomic recovery check."
            })

        # Default low risk guidance if none triggered
        if not guidance:
            if risk_band == "LOW":
                guidance.append({
                    "code": "STANDARD_OPERATIONAL_READINESS",
                    "recommendation": "Personnel parameters within optimal operational thresholds. Continue standard routine monitoring."
                })
            else:
                guidance.append({
                    "code": "ROUTINE_WELFARE_OBSERVATION",
                    "recommendation": "Maintain weekly welfare officer observation."
                })

        return guidance
