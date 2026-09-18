import pytest
from app.services.copilot_service import ask_copilot, generate_heuristic_copilot_response
from tests.conftest import make_claim

def test_copilot_fallback_tag_presence(db_session):
    """Test that ask_copilot appends transparent fallback notice when Anthropic API key is unconfigured."""
    response = ask_copilot(db=db_session, question="Hello copilot")
    assert "Powered by rule-based fallback" in response
    assert "ANTHROPIC_API_KEY" in response


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
