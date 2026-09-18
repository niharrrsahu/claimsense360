import os
import sys
import pytest
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure backend directory is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.database import Base
from app.models.claim import Claim
from app.models.user import User

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    """Provides a fresh, isolated in-memory SQLite database session for each test."""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def make_claim(**kwargs) -> Claim:
    """Utility to create a Claim instance populated with valid non-null defaults."""
    defaults = {
        "customer_name": "Test Customer",
        "vehicle_make_model": "Honda City (2020)",
        "age": 35,
        "vehicle_price": 1000000,
        "claim_amount": 50000,
        "vehicle_age": 3,
        "past_claims": 0,
        "driver_rating": 4,
        "policy_type": "Comprehensive",
        "fault": "Policy Holder",
        "accident_area": "Urban",
        "police_report_filed": True,
        "witness_present": True,
        "incident_severity": "Minor Damage",
        "incident_description": "Standard accident description",
        "narrative_suspicion_score": 20.0,
        "fraud_probability": 0.25,
        "fraud_score": 25.0,
        "overall_risk_score": 25.0,
        "risk_band": "Low risk",
        "recommended_action": "Proceed to approval",
        "damage_severity": "Minor Scuff",
        "damage_score": 20.0,
        "is_seed": False,
        "created_at": datetime.now(timezone.utc),
    }
    defaults.update(kwargs)
    return Claim(**defaults)
