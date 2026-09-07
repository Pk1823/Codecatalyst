"""
FastAPI Microservice for Defense Personnel Stress & Welfare Monitoring System.
Exposes clean REST endpoints for automated risk assessment, anti-masking detection,
and explainable SHAP welfare guidance.
"""

import sys
import os
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add current directory to path so src modules import reliably
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.predictor import StressPredictor

# Global Predictor Instance
predictor: Optional[StressPredictor] = None


def get_predictor() -> StressPredictor:
    """
    Singleton accessor for StressPredictor.
    """
    global predictor
    if predictor is None:
        predictor = StressPredictor()
    return predictor


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to load ML models at startup.
    """
    try:
        get_predictor()
        print("[+] Defense Stress Predictor & SHAP Explainer initialized successfully.")
    except Exception as e:
        print(f"[!] Warning: Failed to load model at startup: {e}")
    yield
    print("[-] Shutting down AI Engine microservice.")


app = FastAPI(
    title="Sentinel AI - Defense Personnel Welfare & Stress Monitoring Engine",
    description="Explainable inference microservice with anti-masking guardrails for Armed Forces / CAPF personnel.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend and backend microservice integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Pydantic Request & Response Schemas
# ==========================================

class PersonnelTelemetry(BaseModel):
    """
    Telemetry payload schema with boundary validation for physiological,
    operational, and psychometric metrics.
    """
    subject_id: str = Field(..., description="Anonymized or unique personnel identifier (e.g. PERS_0001)")
    consecutive_field_days: int = Field(..., ge=0, description="Consecutive days on field/deployment")
    duty_hours_5d: float = Field(..., ge=0.0, description="Cumulative duty hours over past 5 days")
    night_shifts_5d: int = Field(..., ge=0, le=5, description="Number of night shifts in past 5 days (0-5)")
    leave_denial_ratio: float = Field(..., ge=0.0, le=1.0, description="Ratio of denied leave requests (0.0 - 1.0)")
    sleep_hrs_5d_avg: float = Field(..., ge=0.0, le=24.0, description="Average sleep hours per 24h over past 5 days")
    self_reported_energy: int = Field(..., ge=1, le=5, description="Subjective energy level (1: Exhausted, 5: High)")
    self_reported_stress: int = Field(..., ge=1, le=10, description="Subjective acute stress level (1: None, 10: Extreme)")
    survey_latency_sec: float = Field(..., ge=0.0, description="Survey completion time in seconds")
    delta_rhr: float = Field(..., description="Change in resting heart rate relative to baseline in bpm")
    masking_index: float = Field(..., ge=0.0, le=1.0, description="Computed behavioral masking index (0.0 - 1.0)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "subject_id": "PERS_009821",
                "consecutive_field_days": 48,
                "duty_hours_5d": 68.5,
                "night_shifts_5d": 4,
                "leave_denial_ratio": 0.45,
                "sleep_hrs_5d_avg": 3.8,
                "self_reported_energy": 1,
                "self_reported_stress": 8,
                "survey_latency_sec": 42.0,
                "delta_rhr": 6.8,
                "masking_index": 0.12
            }
        }
    }


class ConfidenceScores(BaseModel):
    low: float
    moderate: float
    high: float


class TopDriver(BaseModel):
    feature: str
    value: float
    importance: float
    description: str


class ClinicalGuidance(BaseModel):
    code: str
    recommendation: str


class EvaluationResult(BaseModel):
    risk_band: str
    alert_priority: str
    confidence_scores: ConfidenceScores
    masking_flag: bool
    top_drivers: List[TopDriver]
    clinical_guidance: List[ClinicalGuidance]


class PredictionResponse(BaseModel):
    subject_id: str
    evaluation: EvaluationResult


class HealthResponse(BaseModel):
    status: str
    service: str
    model_loaded: bool


# ==========================================
# REST Endpoints
# ==========================================

@app.get("/health", response_model=HealthResponse, tags=["Monitoring"])
async def health_check():
    """
    Returns service health status and model availability.
    """
    try:
        pred = get_predictor()
        is_loaded = pred is not None and getattr(pred, 'model', None) is not None
    except Exception:
        is_loaded = False

    return HealthResponse(
        status="healthy" if is_loaded else "degraded",
        service="ai-engine",
        model_loaded=is_loaded
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict_personnel_welfare(telemetry: PersonnelTelemetry):
    """
    Inference endpoint for personnel stress evaluation, anti-masking detection,
    and explainable welfare intervention guidance.
    """
    global predictor
    if predictor is None or getattr(predictor, 'model', None) is None:
        try:
            predictor = StressPredictor()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Predictor model is not available: {str(e)}"
            )

    try:
        telemetry_dict = telemetry.model_dump()
        subject_id = telemetry_dict.pop("subject_id")

        evaluation = predictor.predict(telemetry_dict)

        return PredictionResponse(
            subject_id=subject_id,
            evaluation=EvaluationResult(**evaluation)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during personnel stress evaluation: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
