import pytest
from app.services.claims_service import (
    get_claims_summary_stats,
    get_high_risk_claims,
    get_claim_by_id,
)
from tests.conftest import make_claim

def test_get_claims_summary_stats_empty_db(db_session):
    """Test auto-seeding behavior when calculating stats on an empty database."""
    stats = get_claims_summary_stats(db=db_session)
    assert stats.total_claims == 6
    assert stats.high_risk_count == 3
    assert stats.low_risk_count == 3
    assert stats.avg_risk_score > 0.0


def test_get_claims_summary_stats_with_data(db_session):
    """Test summary stats calculation with populated claims."""
    claim1 = make_claim(
        customer_name="Test User 1",
        vehicle_make_model="Honda City",
        claim_amount=50000,
        overall_risk_score=75.0,
        risk_band="High risk",
        recommended_action="Flag for SIU"
    )
    claim2 = make_claim(
        customer_name="Test User 2",
        vehicle_make_model="Maruti Swift",
        claim_amount=20000,
        overall_risk_score=20.0,
        risk_band="Low risk",
        recommended_action="Proceed to approval"
    )
    db_session.add_all([claim1, claim2])
    db_session.commit()

    stats = get_claims_summary_stats(db=db_session)
    assert stats.total_claims == 2
    assert stats.avg_claim_amount == 35000
    assert stats.avg_risk_score == 47.5
    assert stats.high_risk_count == 1
    assert stats.low_risk_count == 1


def test_get_high_risk_claims(db_session):
    """Test filtering claims by high risk band."""
    high_claim = make_claim(
        customer_name="High Risk Customer",
        vehicle_make_model="Hyundai Creta",
        overall_risk_score=85.0,
        risk_band="High risk",
        recommended_action="Flag for SIU"
    )
    low_claim = make_claim(
        customer_name="Low Risk Customer",
        vehicle_make_model="Tata Tiago",
        overall_risk_score=15.0,
        risk_band="Low risk",
        recommended_action="Proceed to approval"
    )
    db_session.add_all([high_claim, low_claim])
    db_session.commit()

    high_risks = get_high_risk_claims(db=db_session)
    assert len(high_risks) == 1
    assert high_risks[0].customer_name == "High Risk Customer"


def test_get_claim_by_id(db_session):
    """Test retrieving a claim by its primary key ID."""
    claim = make_claim(
        customer_name="Specific Customer",
        vehicle_make_model="Toyota Fortuner",
        claim_amount=100000,
        overall_risk_score=40.0,
        risk_band="Moderate risk",
        recommended_action="Require Secondary Photo Verification"
    )
    db_session.add(claim)
    db_session.commit()

    retrieved = get_claim_by_id(db=db_session, claim_id=claim.id)
    assert retrieved is not None
    assert retrieved.customer_name == "Specific Customer"
    assert retrieved.claim_amount == 100000

    not_found = get_claim_by_id(db=db_session, claim_id=99999)
    assert not_found is None


def test_image_disk_save_failure_fallback_to_base64(db_session):
    """Test that when disk write fails, image_b64_fallback is stored in db_claim.image_data."""
    from unittest.mock import patch
    from app.schemas.claim import ClaimInput
    from app.services.claims_service import analyze_and_save_claim

    claim_input = ClaimInput(
        customer_name="Fallback Test User",
        vehicle_make_model="Honda Accord",
        age=30,
        vehicle_price=1200000,
        claim_amount=40000,
        vehicle_age=2,
        past_claims=0,
        driver_rating=4,
        policy_type="Comprehensive",
        fault="Policy Holder",
        accident_area="Urban",
        police_report_filed=True,
        witness_present=True,
        incident_severity="Minor Damage",
        incident_description="Minor bumper dent."
    )
    dummy_image = b"fake_jpeg_data_bytes"
    
    with patch("app.services.claims_service.open", side_effect=OSError("Disk write permission denied")):
        res = analyze_and_save_claim(db=db_session, claim_input=claim_input, image_bytes=dummy_image)
        
    assert res.claim_id is not None
    saved_claim = get_claim_by_id(db=db_session, claim_id=res.claim_id)
    assert saved_claim is not None
    assert saved_claim.image_path is None
    assert saved_claim.image_data is not None
    assert saved_claim.image_data.startswith("data:image/jpeg;base64,")
