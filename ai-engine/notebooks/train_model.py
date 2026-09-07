"""
Training Pipeline for Defense Personnel Stress & Welfare Monitoring System
Trains a LightGBM multi-class classifier on defense stress telemetry data.
"""

import os
import joblib
import numpy as np
import pandas as pd
import lightgbm as lgb
import shap
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    balanced_accuracy_score,
    f1_score,
    confusion_matrix
)

# Define feature schema
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
TARGET_COLUMN = 'risk_label'

def train():
    # Resolve relative paths robustly
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_path = os.path.join(base_dir, 'data', 'defense_stress_training_data.csv')
    models_dir = os.path.join(base_dir, 'models')
    model_output_path = os.path.join(models_dir, 'defense_stress_lgbm_model.joblib')

    os.makedirs(models_dir, exist_ok=True)

    print(f"[*] Loading training data from: {data_path}")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Training dataset not found at {data_path}")

    df = pd.read_csv(data_path)
    print(f"[*] Dataset loaded successfully. Shape: {df.shape}")

    # Check for missing values
    df_clean = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN]).copy()
    print(f"[*] Clean dataset shape: {df_clean.shape}")

    X = df_clean[FEATURE_COLUMNS]
    y = df_clean[TARGET_COLUMN].astype(int)

    # Class distribution
    print("\n[*] Class distribution in dataset:")
    class_counts = y.value_counts().sort_index()
    for label, count in class_counts.items():
        print(f"    Class {label} ({['Low', 'Moderate', 'High'][label]}): {count} ({count/len(y):.2%})")

    # Stratified Train (70%) / Validation (15%) / Test (15%)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.30, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp
    )

    print(f"\n[*] Split summary: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)}")

    # Initialize LightGBM Classifier with class balancing to handle defense stress class imbalance
    clf = lgb.LGBMClassifier(
        objective='multiclass',
        num_class=3,
        class_weight='balanced',
        n_estimators=200,
        learning_rate=0.05,
        max_depth=6,
        num_leaves=31,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=-1
    )

    print("[*] Fitting LightGBM model...")
    clf.fit(
        X_train,
        y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[lgb.early_stopping(stopping_rounds=20, verbose=False)]
    )

    # Evaluate on Test Set
    print("\n[*] Evaluating on hold-out Test Set:")
    y_test_pred = clf.predict(X_test)
    y_test_proba = clf.predict_proba(X_test)

    bal_acc = balanced_accuracy_score(y_test, y_test_pred)
    macro_f1 = f1_score(y_test, y_test_pred, average='macro')
    weighted_f1 = f1_score(y_test, y_test_pred, average='weighted')
    cm = confusion_matrix(y_test, y_test_pred)

    print(f"    Balanced Accuracy : {bal_acc:.4f}")
    print(f"    Macro F1-Score    : {macro_f1:.4f}")
    print(f"    Weighted F1-Score : {weighted_f1:.4f}")
    print("\n[*] Confusion Matrix (Rows: True, Cols: Pred):")
    print(cm)
    print("\n[*] Classification Report:")
    print(classification_report(y_test, y_test_pred, target_names=['Low (0)', 'Moderate (1)', 'High (2)'], digits=4))

    # Initialize SHAP TreeExplainer to verify tree explainability compatibility
    print("[*] Initializing SHAP TreeExplainer...")
    explainer = shap.TreeExplainer(clf)
    sample_shap = explainer.shap_values(X_test.iloc[:5])
    print("[*] SHAP TreeExplainer successfully initialized and verified on sample test rows.")

    # Save Model Artifact Bundle
    artifact_payload = {
        'model': clf,
        'feature_names': FEATURE_COLUMNS,
        'classes': [0, 1, 2],
        'class_names': ['Low', 'Moderate', 'High'],
        'metrics': {
            'balanced_accuracy': float(bal_acc),
            'macro_f1': float(macro_f1),
            'weighted_f1': float(weighted_f1)
        }
    }

    joblib.dump(artifact_payload, model_output_path)
    print(f"\n[+] Model and metadata artifact successfully saved to: {model_output_path}")

if __name__ == '__main__':
    train()
