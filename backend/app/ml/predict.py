"""
Inference & SHAP Explainer Module for Fraud Detection Model
"""

import os
import functools
import warnings
import joblib
import numpy as np
import pandas as pd
warnings.filterwarnings("ignore")



@functools.lru_cache(maxsize=1)
def load_fraud_artifacts():
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_models"))
    model_path = os.path.join(models_dir, "fraud_model.joblib")
    prep_path = os.path.join(models_dir, "preprocessor.joblib")
    feat_path = os.path.join(models_dir, "feature_names.joblib")
    
    if not os.path.exists(model_path) or not os.path.exists(prep_path):
        raise FileNotFoundError("ML model artifacts missing. Run train_fraud_model.py first.")
        
    model = joblib.load(model_path)
    preprocessor = joblib.load(prep_path)
    feature_names = joblib.load(feat_path)
    import shap
    explainer = shap.TreeExplainer(model)
    return model, preprocessor, feature_names, explainer


FEATURE_NAME_MAP = {
    "age": "Driver Age",
    "vehicle_price": "Vehicle Price",
    "claim_amount": "Claim Amount",
    "vehicle_age": "Vehicle Age",
    "past_claims": "Past Claims History",
    "driver_rating": "Driver Rating",
    "policy_type": "Policy Type",
    "fault": "Fault Allocation",
    "accident_area": "Accident Area",
    "police_report_filed": "Police Report Filed",
    "witness_present": "Witness Present",
    "incident_severity": "Incident Severity"
}

def predict_fraud(claim_dict: dict) -> tuple[float, float, list[dict]]:
    """
    Given a claim dictionary, computes fraud_probability, fraud_score (0-100),
    and top SHAP factor contributions.
    """
    model, preprocessor, feature_names, explainer = load_fraud_artifacts()
    
    df_input = pd.DataFrame([claim_dict])
    X_trans = preprocessor.transform(df_input)
    
    proba = float(model.predict_proba(X_trans)[0, 1])
    fraud_score = round(proba * 100, 1)
    
    # Compute SHAP values
    shap_vals = explainer.shap_values(X_trans)[0]
    
    # Aggregate SHAP contributions back to original input features
    # Numerical & Boolean map directly 1:1; One-hot categories sum up
    agg_shap = {}
    for feat_raw, val in zip(feature_names, shap_vals):
        if feat_raw.startswith("policy_type_"):
            orig = "policy_type"
        elif feat_raw.startswith("fault_"):
            orig = "fault"
        elif feat_raw.startswith("accident_area_"):
            orig = "accident_area"
        elif feat_raw.startswith("incident_severity_"):
            orig = "incident_severity"
        else:
            orig = feat_raw
            
        agg_shap[orig] = agg_shap.get(orig, 0.0) + float(val)
        
    # Sort factors by absolute magnitude
    sorted_factors = sorted(agg_shap.items(), key=lambda x: abs(x[1]), reverse=True)
    
    top_factors = []
    for feat_key, contribution in sorted_factors[:5]:
        friendly_name = FEATURE_NAME_MAP.get(feat_key, feat_key.replace("_", " ").title())
        top_factors.append({
            "feature": feat_key,
            "name": friendly_name,
            "contribution": round(contribution, 3),
            "effect": "increases_risk" if contribution > 0 else "decreases_risk"
        })
        
    return proba, fraud_score, top_factors
