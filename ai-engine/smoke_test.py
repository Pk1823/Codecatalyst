"""
Smoke test suite for AI Engine: Testing StressPredictor and FastAPI endpoints.
"""

import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.predictor import StressPredictor
from fastapi.testclient import TestClient
from main import app

def run_tests():
    print("==================================================")
    print("[*] Starting AI-Engine Smoke Tests")
    print("==================================================")

    # Test 1: Direct StressPredictor validation
    print("\n--- Test 1: Unit Test - StressPredictor Direct ---")
    predictor = StressPredictor()

    # Case A: High Strain profile
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

    # Case B: Deliberate Masking profile (Macho culture: soldier reports low stress & fast survey despite extreme fatigue)
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
    print("\n[+] Masked Stress Case Output:")
    print(json.dumps(res_masked, indent=2))
    assert res_masked["masking_flag"] is True, "Masking flag should be True"
    assert res_masked["alert_priority"] in ["DISCREET_CHECK", "URGENT"], "Alert priority should flag discreet check"

    # Test 2: FastAPI Integration Tests via TestClient
    print("\n--- Test 2: FastAPI Integration Tests ---")
    with TestClient(app) as client:
        # GET /health
        health_resp = client.get("/health")
        print(f"[+] GET /health Status: {health_resp.status_code}")
        print(f"    Body: {health_resp.json()}")
        assert health_resp.status_code == 200
        assert health_resp.json()["status"] == "healthy"
        assert health_resp.json()["model_loaded"] is True

        # POST /predict
        api_payload = {
            "subject_id": "PERS_COMBAT_091",
            **masked_payload
        }
        predict_resp = client.post("/predict", json=api_payload)
        print(f"\n[+] POST /predict Status: {predict_resp.status_code}")
        print(f"    Body:\n{json.dumps(predict_resp.json(), indent=2)}")
        assert predict_resp.status_code == 200
        data = predict_resp.json()
        assert data["subject_id"] == "PERS_COMBAT_091"
        assert "evaluation" in data
        assert len(data["evaluation"]["top_drivers"]) == 3
        assert len(data["evaluation"]["clinical_guidance"]) > 0

    print("\n==================================================")
    print("[SUCCESS] All AI-Engine Smoke Tests Passed Cleanly!")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
