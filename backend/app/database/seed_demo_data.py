import os
import sys
from datetime import datetime, timedelta, timezone

# Ensure root directory is on PYTHONPATH when executed as script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.database.database import Base, engine
from app.database.session import SessionLocal
from app.database.init_db import init_db
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.core.security import hash_password
from app.models.user import User
from app.models.claim import Claim

from sqlalchemy import text

def seed_demo_data():
    try:
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS damage_images CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS ai_predictions CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS documents CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS claims CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
            conn.commit()
    except Exception as e:
        print(f"Drop warning: {e}")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()


    try:
        # 1. Seed Demo Admin User
        user = db.query(User).filter(User.email == "admin@claimsense.ai").first()

        if not user:
            user_in = UserCreate(
                full_name="ClaimSense Admin",
                email="admin@claimsense.ai",
                password="password123",
            )
            user = create_user(db, user_in)
            if user:
                user.role = "admin"
                db.commit()
                db.refresh(user)
                print("Demo user created successfully: admin@claimsense.ai / password123")
        else:
            user.password = hash_password("password123")
            db.commit()
            print("Demo user password updated to: password123")

        # 2. Seed Demo Claims if empty
        existing_claims_count = db.query(Claim).count()
        if existing_claims_count == 0:
            now = datetime.now(timezone.utc)
            demo_claims = [
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Rahul Sharma",
                    vehicle_make_model="Honda City (2022)",
                    age=34,
                    vehicle_price=1200000,
                    claim_amount=45000,
                    vehicle_age=2,
                    past_claims=0,
                    driver_rating=5,
                    policy_type="Sedan",
                    fault="Policy Holder",
                    accident_area="Urban",
                    police_report_filed=True,
                    witness_present=True,
                    incident_description="Minor bumper dent while parking at urban mall garage. Low speed collision.",
                    narrative_suspicion_score=8.5,
                    fraud_probability=0.14,
                    fraud_score=14.0,
                    overall_risk_score=15.0,
                    risk_band="low",
                    recommended_action="Fast-track settlement",
                    damage_severity="Minor Bumper Scuff",
                    damage_score=18.5,
                    created_at=now - timedelta(hours=2),
                ),
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Priya Patel",
                    vehicle_make_model="Hyundai Creta (2021)",
                    age=29,
                    vehicle_price=1500000,
                    claim_amount=88000,
                    vehicle_age=3,
                    past_claims=1,
                    driver_rating=4,
                    policy_type="SUV",
                    fault="Third Party",
                    accident_area="Urban",
                    police_report_filed=True,
                    witness_present=False,
                    incident_description="Side door scratched and dented by passing autorickshaw at traffic junction.",
                    narrative_suspicion_score=12.0,
                    fraud_probability=0.25,
                    fraud_score=25.0,
                    overall_risk_score=26.0,
                    risk_band="low",
                    recommended_action="Proceed to approval",
                    damage_severity="Moderate Side Panel Dent",
                    damage_score=32.0,
                    created_at=now - timedelta(hours=5),
                ),
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Amit Verma",
                    vehicle_make_model="BMW 3 Series (2023)",
                    age=23,
                    vehicle_price=4500000,
                    claim_amount=340000,
                    vehicle_age=1,
                    past_claims=4,
                    driver_rating=1,
                    policy_type="Sedan",
                    fault="Policy Holder",
                    accident_area="Rural",
                    police_report_filed=False,
                    witness_present=False,
                    incident_description="Late night collision on rural highway around 3:00 AM. Total front bumper and radiator damaged. No police report filed.",
                    narrative_suspicion_score=82.0,
                    fraud_probability=0.76,
                    fraud_score=76.0,
                    overall_risk_score=78.0,
                    risk_band="high",
                    recommended_action="Flag for fraud audit",
                    damage_severity="Severe Frontal Impact",
                    damage_score=82.4,
                    created_at=now - timedelta(hours=8),
                ),
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Neha Gupta",
                    vehicle_make_model="Maruti Swift (2020)",
                    age=41,
                    vehicle_price=700000,
                    claim_amount=32000,
                    vehicle_age=4,
                    past_claims=0,
                    driver_rating=5,
                    policy_type="Hatchback",
                    fault="Third Party",
                    accident_area="Urban",
                    police_report_filed=True,
                    witness_present=True,
                    incident_description="Rear taillight cracked during parking maneuver by adjacent vehicle.",
                    narrative_suspicion_score=5.0,
                    fraud_probability=0.12,
                    fraud_score=12.0,
                    overall_risk_score=12.0,
                    risk_band="low",
                    recommended_action="Fast-track settlement",
                    damage_severity="Minor Rear Housing Damage",
                    damage_score=14.0,
                    created_at=now - timedelta(days=1),
                ),
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Vikram Singh",
                    vehicle_make_model="Mahindra Thar (2022)",
                    age=26,
                    vehicle_price=1800000,
                    claim_amount=195000,
                    vehicle_age=2,
                    past_claims=3,
                    driver_rating=2,
                    policy_type="Utility",
                    fault="Policy Holder",
                    accident_area="Rural",
                    police_report_filed=False,
                    witness_present=False,
                    incident_description="Vehicle rolled into ditch during off-road weekend trip. Delayed reporting by 5 days.",
                    narrative_suspicion_score=75.0,
                    fraud_probability=0.68,
                    fraud_score=68.0,
                    overall_risk_score=71.0,
                    risk_band="high",
                    recommended_action="Flag for fraud audit",
                    damage_severity="Severe Axle & Undercarriage Damage",
                    damage_score=75.0,
                    created_at=now - timedelta(days=2),
                ),
                Claim(
                    user_id=user.id if user else None,
                    customer_name="Ananya Roy",
                    vehicle_make_model="Tata Nexon EV (2023)",
                    age=32,
                    vehicle_price=1400000,
                    claim_amount=62000,
                    vehicle_age=1,
                    past_claims=0,
                    driver_rating=4,
                    policy_type="SUV",
                    fault="Third Party",
                    accident_area="Urban",
                    police_report_filed=True,
                    witness_present=True,
                    incident_description="Minor hail damage on windshield and bonnet during heavy monsoon storm.",
                    narrative_suspicion_score=10.0,
                    fraud_probability=0.18,
                    fraud_score=18.0,
                    overall_risk_score=19.0,
                    risk_band="low",
                    recommended_action="Proceed to approval",
                    damage_severity="Minor Glass & Bonnet Scruffs",
                    damage_score=20.0,
                    created_at=now - timedelta(days=3),
                ),
            ]
            db.add_all(demo_claims)
            db.commit()
            print(f"Successfully seeded {len(demo_claims)} realistic demo claims into database!")
        else:
            print(f"Database already contains {existing_claims_count} claims.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
