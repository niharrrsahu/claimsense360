from unittest.mock import MagicMock, patch
import pytest

from app.services.copilot_service import (
    _ask_gemini,
    _build_claim_context,
    ask_copilot,
    generate_heuristic_copilot_response,
)
from tests.conftest import make_claim


def test_copilot_fallback_tag_presence(db_session):
    """Test that ask_copilot appends transparent fallback notice when API keys are unconfigured."""
    with patch.dict("os.environ", {}, clear=True):
        response = ask_copilot(db=db_session, question="Hello copilot")
        assert "Powered by rule-based fallback" in response
        assert "GEMINI_API_KEY" in response


def test_copilot_claim_id_lookup(db_session):
    """Test copilot natural language claim ID lookup query."""
    claim = make_claim(
        customer_name="Rohan Sharma",
        vehicle_make_model="Mahindra Thar (2022)",
        claim_amount=85000,
        overall_risk_score=65.0,
        risk_band="High risk",
        recommended_action="Flag for SIU Fraud Audit",
        incident_description="Frontal collision with streetlight."
    )
    db_session.add(claim)
    db_session.commit()

    resp = generate_heuristic_copilot_response(db=db_session, question=f"Explain claim #{claim.id}")
    assert f"Claim #{claim.id} Deep-Dive Audit" in resp
    assert "Rohan Sharma" in resp
    assert "Score **65.0/100**" in resp
    assert "HIGH RISK" in resp


def test_copilot_high_risk_query(db_session):
    """Test copilot response for high risk claims query."""
    claim = make_claim(
        customer_name="Anita Roy",
        vehicle_make_model="Kia Seltos",
        claim_amount=120000,
        overall_risk_score=72.0,
        risk_band="High risk",
        recommended_action="Flag for SIU Fraud Audit"
    )
    db_session.add(claim)
    db_session.commit()

    resp = generate_heuristic_copilot_response(db=db_session, question="Show high risk claims")
    assert "High-Risk Claims Audit Summary" in resp
    assert "Anita Roy" in resp
    assert "Score: **72.0/100**" in resp


def test_copilot_gemini_integration(db_session):
    """Test that ask_copilot invokes Google Gemini API when GEMINI_API_KEY is configured."""
    expected_ai_text = "Gemini AI Response: Claim #1 has been analyzed. Fraud probability is low."
    
    with patch("app.services.copilot_service._ask_gemini", return_value=expected_ai_text) as mock_gemini, \
         patch.dict("os.environ", {"GEMINI_API_KEY": "AIzaSy_test_key_123"}, clear=True):
        
        res = ask_copilot(db=db_session, question="Analyze claim #1")
        assert res == expected_ai_text
        mock_gemini.assert_called_once()
