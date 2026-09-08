"""
Training Pipeline for Defense Personnel Stress & Welfare Monitoring System
Trains a LightGBM multi-class classifier on defense stress telemetry data.
Calibrated to achieve an authentic test accuracy between 70% and 85%.
"""

import os
import joblib
import numpy as np
import pandas as pd
import lightgbm as lgb
import shap
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    balanced_accuracy_score,
    f1_score,
    precision_score,
    recall_score,
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

    # If dataset does not exist, generate it automatically
    if not os.path.exists(data_path):
        from generate_dataset import generate_defense_stress_dataset
        print("[*] Generating dataset on the fly...")
        df_gen = generate_defense_stress_dataset(num_samples=5000)
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df_gen.to_csv(data_path, index=False)

    print(f"[*] Loading training data from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"[*] Dataset loaded successfully. Shape: {df.shape}")

    # Clean data
    df_clean = df.dropna(subset=FEATURE_COLUMNS + [TARGET_COLUMN]).copy()
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

    # Initialize LightGBM Classifier tuned for balanced performance in the 70% - 85% range
    clf = lgb.LGBMClassifier(
        objective='multiclass',
        num_class=3,
        class_weight='balanced',
        n_estimators=160,
        learning_rate=0.06,
        max_depth=5,
        num_leaves=24,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        verbosity=-1
    )

    print("[*] Fitting LightGBM model...")
    clf.fit(
        X_train,
        y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[lgb.early_stopping(stopping_rounds=15, verbose=False)]
    )

    # Evaluate on Test Set
    print("\n[*] Evaluating on hold-out Test Set:")
    y_test_pred = clf.predict(X_test)
    y_test_proba = clf.predict_proba(X_test)

    acc = accuracy_score(y_test, y_test_pred)
    bal_acc = balanced_accuracy_score(y_test, y_test_pred)
    macro_f1 = f1_score(y_test, y_test_pred, average='macro')
    weighted_f1 = f1_score(y_test, y_test_pred, average='weighted')
    macro_prec = precision_score(y_test, y_test_pred, average='macro')
    macro_rec = recall_score(y_test, y_test_pred, average='macro')
    cm = confusion_matrix(y_test, y_test_pred)

    print(f"    Raw Accuracy      : {acc:.4f} ({acc*100:.1f}%)")
    print(f"    Balanced Accuracy : {bal_acc:.4f} ({bal_acc*100:.1f}%)")
    print(f"    Macro Precision   : {macro_prec:.4f}")
    print(f"    Macro Recall      : {macro_rec:.4f}")
    print(f"    Macro F1-Score    : {macro_f1:.4f}")
    print(f"    Weighted F1-Score : {weighted_f1:.4f}")
    print("\n[*] Confusion Matrix (Rows: True, Cols: Pred):")
    print(cm)
    print("\n[*] Classification Report:")
    print(classification_report(y_test, y_test_pred, target_names=['Low (0)', 'Moderate (1)', 'High (2)'], digits=4))

    # Feature Importance
    feature_importances = {
        feat: float(imp) for feat, imp in zip(FEATURE_COLUMNS, clf.feature_importances_)
    }

    # Initialize SHAP TreeExplainer
    print("[*] Initializing SHAP TreeExplainer...")
    explainer = shap.TreeExplainer(clf)
    sample_shap = explainer.shap_values(X_test.iloc[:5])
    print("[*] SHAP TreeExplainer successfully initialized.")

    # Save Model Artifact Bundle
    artifact_payload = {
        'model': clf,
        'feature_names': FEATURE_COLUMNS,
        'classes': [0, 1, 2],
        'class_names': ['Low', 'Moderate', 'High'],
        'feature_importances': feature_importances,
        'metrics': {
            'accuracy': float(acc),
            'balanced_accuracy': float(bal_acc),
            'precision': float(macro_prec),
            'recall': float(macro_rec),
            'macro_f1': float(macro_f1),
            'weighted_f1': float(weighted_f1),
            'test_samples': int(len(X_test)),
            'target_range': '70% - 85%'
        }
    }

    joblib.dump(artifact_payload, model_output_path)
    print(f"\n[+] Model and metadata artifact successfully saved to: {model_output_path}")
    return artifact_payload

if __name__ == '__main__':
    train()
