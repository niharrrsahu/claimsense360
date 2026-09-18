"""
Real Kaggle CSV Dataset Seeder for ClaimSense 360
Reads authentic insurance claim records from backend/app/data/insurance_claims_real.csv
and passes them through the trained XGBoost + TF-IDF ML pipeline to populate SQLite DB.
"""

import os
import sys
from datetime import datetime, timedelta, timezone

import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.database.database import SessionLocal
from app.ml.predict import predict_fraud
from app.models.claim import Claim


def _get_val(row: pd.Series, key: str, default):
    return row[key] if key in row and pd.notna(row[key]) else default


def _extract_kaggle_row(idx: int, row: pd.Series) -> dict:
    """Helper to extract and normalize raw Kaggle CSV attributes."""
    age = int(_get_val(row, "age", 35))
    policy_num = str(_get_val(row, "policy_number", f"100{idx+1}"))
    make = str(_get_val(row, "auto_make", "Vehicle"))
    model = str(_get_val(row, "auto_model", "Model"))
    year = int(_get_val(row, "auto_year", 2020))
    
    claim_amt = int(_get_val(row, "total_claim_amount", 50000))
    price = int(_get_val(row, "vehicle_price", 1000000))
    v_age = int(_get_val(row, "vehicle_age", 3))
    past_c = int(_get_val(row, "past_claims", 0))
    d_rating = int(_get_val(row, "driver_rating", 4))
    
    pol_type = str(_get_val(row, "policy_type", "Comprehensive"))
    fault = str(_get_val(row, "fault", "Policy Holder"))
    area = str(_get_val(row, "accident_area", "Urban"))
    
    police_avail = str(_get_val(row, "police_report_available", "NO")).upper() == "YES"
    witnesses = int(_get_val(row, "witnesses", 0))
    
    inc_type = str(_get_val(row, "incident_type", "Collision"))
    coll_type = str(_get_val(row, "collision_type", "Front Collision"))
    inc_city = str(_get_val(row, "incident_city", "Metropolis"))
    inc_hour = int(_get_val(row, "incident_hour_of_the_day", 12))
    auth_contacted = str(_get_val(row, "authorities_contacted", "Police"))
    incident_severity = str(_get_val(row, "incident_severity", "Minor Damage"))

    description = (
        f"Kaggle Row #{idx+1} (Policy #{policy_num}): {inc_type} ({coll_type}) at {inc_city}, "
        f"time {inc_hour}:00. Authorities: {auth_contacted}. Witnesses: {witnesses}. Police report: {'Filed' if police_avail else 'Not filed'}."
    )
    occupation = str(row.get("insured_occupation", "Specialist")).title()

    return {
        "idx": idx,
        "age": age,
        "policy_num": policy_num,
        "make_model": f"{make} {model} ({year})",
        "claim_amt": claim_amt,
        "price": price,
        "v_age": v_age,
        "past_c": past_c,
        "d_rating": d_rating,
        "pol_type": pol_type,
        "fault": fault,
        "area": area,
        "police_avail": police_avail,
        "witness_present": witnesses > 0,
        "incident_severity": incident_severity,
        "description": description,
        "cust_name": f"Policyholder #{policy_num} ({occupation})",
    }


def _build_seeded_claim_obj(row_data: dict, now: datetime) -> Claim:
    """Helper to compute ML predictions and instantiate a Claim ORM object."""
    proba, overall_score, _top_factors = predict_fraud({
        "age": row_data["age"],
        "vehicle_price": row_data["price"],
        "claim_amount": row_data["claim_amt"],
        "vehicle_age": row_data["v_age"],
        "past_claims": row_data["past_c"],
        "driver_rating": row_data["d_rating"],
        "policy_type": row_data["pol_type"],
        "fault": row_data["fault"],
        "accident_area": row_data["area"],
        "police_report_filed": row_data["police_avail"],
        "witness_present": row_data["witness_present"],
        "incident_severity": row_data["incident_severity"],
        "incident_description": row_data["description"],
    })
    
    fraud_prob = round(proba, 2)
    risk_band = "High risk" if overall_score >= 50.0 else ("Moderate risk" if overall_score >= 30.0 else "Low risk")
    rec_action = "Flag for SIU Fraud Audit" if overall_score >= 50.0 else ("Require Secondary Photo Verification" if overall_score >= 30.0 else "Proceed to approval")
    narrative_score = round(overall_score * 0.85, 1)
    damage_sev = "Major Crush" if overall_score > 60 else ("Moderate Dent" if overall_score > 30 else "Minor Scuff")
    damage_sc = round(overall_score * 0.95, 1)

    return Claim(
        customer_name=row_data["cust_name"],
        vehicle_make_model=row_data["make_model"],
        age=row_data["age"],
        vehicle_price=row_data["price"],
        claim_amount=row_data["claim_amt"],
        vehicle_age=row_data["v_age"],
        past_claims=row_data["past_c"],
        driver_rating=row_data["d_rating"],
        policy_type=row_data["pol_type"],
        fault=row_data["fault"],
        accident_area=row_data["area"],
        police_report_filed=row_data["police_avail"],
        witness_present=row_data["witness_present"],
        incident_severity=row_data["incident_severity"],
        incident_description=row_data["description"],
        narrative_suspicion_score=narrative_score,
        fraud_probability=fraud_prob,
        fraud_score=overall_score,
        overall_risk_score=overall_score,
        risk_band=risk_band,
        recommended_action=rec_action,
        damage_severity=damage_sev,
        damage_score=damage_sc,
        created_at=now - timedelta(days=row_data["idx"] + 1),
    )


def seed_kaggle_claims(n_rows: int = 15):
    """Main orchestration function to clear DB and seed authentic Kaggle claims."""
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/insurance_claims_real.csv"))
    if not os.path.exists(csv_path):
        print(f"Error: Kaggle CSV dataset not found at {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"Loaded Kaggle Dataset with {len(df)} total rows.")

    db = SessionLocal()
    try:
        db.query(Claim).delete()
        db.commit()

        now = datetime.now(timezone.utc)
        seeded_count = 0

        for idx, row in df.head(n_rows).iterrows():
            row_data = _extract_kaggle_row(idx, row)
            claim_obj = _build_seeded_claim_obj(row_data, now)
            db.add(claim_obj)
            seeded_count += 1

        db.commit()
        print(f"Successfully seeded {seeded_count} authentic Kaggle claims into SQLite database!")
    except Exception as e:
        print(f"Error seeding Kaggle dataset: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_kaggle_claims(15)
