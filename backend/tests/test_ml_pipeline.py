import pytest
from app.ml.predict import predict_fraud
from app.ml.nlp_predict import analyze_narrative

def test_predict_fraud_low_risk():
    """Test ML fraud prediction for a routine low-risk claim."""
    input_data = {
        "age": 42,
        "vehicle_price": 1500000,
        "claim_amount": 25000,
        "vehicle_age": 2,
        "past_claims": 0,
        "driver_rating": 5,
        "policy_type": "Comprehensive",
        "fault": "Third Party",
        "accident_area": "Rural",
        "police_report_filed": True,
        "witness_present": True,
        "incident_severity": "Minor Damage",
        "incident_description": "Minor bumper scratch in parking lot while stationary.",
    }
    proba, overall_score, top_factors = predict_fraud(input_data)
    
    assert isinstance(proba, float)
    assert 0.0 <= proba <= 1.0
    assert isinstance(overall_score, float)
    assert 0.0 <= overall_score <= 100.0
    assert overall_score < 50.0  # Should be low/moderate risk
    assert isinstance(top_factors, list)


def test_predict_fraud_high_risk():
    """Test ML fraud prediction for a highly suspicious claim profile."""
    input_data = {
        "age": 21,
        "vehicle_price": 500000,
        "claim_amount": 480000,
        "vehicle_age": 8,
        "past_claims": 4,
        "driver_rating": 1,
        "policy_type": "Third Party Only",
        "fault": "Policy Holder",
        "accident_area": "Urban",
        "police_report_filed": False,
        "witness_present": False,
        "incident_severity": "Major Damage",
        "incident_description": "Total vehicle destruction late at night with no witnesses and no police report.",
    }
    proba, overall_score, top_factors = predict_fraud(input_data)
    
    assert overall_score >= 30.0  # Suspicious indicators present
    assert len(top_factors) > 0


def test_analyze_narrative_suspicious_keywords():
    """Test NLP narrative analysis on suspicious text cues."""
    narrative = "The car caught fire suddenly at 3 AM on a deserted road. No police filed."
    result = analyze_narrative(narrative)
    
    assert isinstance(result, dict)
    assert "suspicion_score" in result
    assert "label" in result
    assert "flagged_phrases" in result
    assert isinstance(result["suspicion_score"], float)
    assert 0.0 <= result["suspicion_score"] <= 100.0
    assert isinstance(result["flagged_phrases"], list)
