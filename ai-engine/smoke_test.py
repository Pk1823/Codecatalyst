"""
Smoke test suite for AI Engine: Testing StressPredictor and endpoints.
"""

import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.predictor import StressPredictor

def run_tests():
    print("==================================================")
    print("[*] Starting AI-Engine Smoke Tests")
    print("==================================================")

    predictor = StressPredictor()

    # Test 0: Model info
    info = predictor.get_model_info()
    print("\n--- Test 0: Model Info ---")
    print(json.dumps(info, indent=2))
    assert info["accuracy"] >= 0.70 and info["accuracy"] <= 0.85, "Accuracy should be in 70-85% range"
    assert info["shap_explainer_active"] is True

    # Test 1: High Strain profile
    print("\n--- Test 1: High Strain Evaluation ---")
    high_strain_payload = {
        "consecutive_field_days": 65,
        "duty_hours_5d": 78.0,
        "night_shifts_5d": 4,
        "leave_denial_ratio": 0.60,
        "sleep_hrs_5d_avg": 3.2,
        "self_reported_energy": 1,
        "self_reported_stress": 9,
        "survey_latency_sec": 65.0,
        "delta_rhr": 8.5,
        "masking_index": 0.08
    }
    res_high = predictor.predict(high_strain_payload)
    print("[+] High Strain Case Output:")
    print(json.dumps(res_high, indent=2))
    assert res_high["risk_band"] in ["MODERATE", "HIGH"], "Expected elevated risk band"

    # Test 2: Deliberate Masking profile
    print("\n--- Test 2: Masked Stress Evaluation ---")
    masked_payload = {
        "consecutive_field_days": 55,
        "duty_hours_5d": 72.0,
        "night_shifts_5d": 4,
        "leave_denial_ratio": 0.50,
        "sleep_hrs_5d_avg": 3.5,
        "self_reported_energy": 5, # False positive bravado
        "self_reported_stress": 1, # False denial
        "survey_latency_sec": 8.0,  # Fast survey completion (<15s)
        "delta_rhr": 7.2,
        "masking_index": 0.48      # High masking score (>0.35)
    }
    res_masked = predictor.predict(masked_payload)
    print("[+] Masked Stress Case Output:")
    print(json.dumps(res_masked, indent=2))
    assert res_masked["masking_flag"] is True, "Masking flag should be True"

    # Test 3: Batch Evaluation
    print("\n--- Test 3: Batch Evaluation ---")
    batch_items = [
        {"subject_id": "P-1001", **high_strain_payload},
        {"subject_id": "P-1002", **masked_payload}
    ]
    batch_res = predictor.predict_batch(batch_items)
    print(f"[+] Batch evaluated {len(batch_res)} records successfully.")

    print("\n==================================================")
    print("[SUCCESS] All AI-Engine Unit Tests Passed Cleanly!")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
