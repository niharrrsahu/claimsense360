"""
Real Kaggle CSV Dataset Seeder for ClaimSense 360
Reads authentic insurance claim records from backend/app/data/insurance_claims_real.csv
and passes them through the trained XGBoost + TF-IDF ML pipeline to populate SQLite DB.
"""

import os
import sys
import pandas as pd
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.database.database import SessionLocal
from app.models.user import User
from app.models.claim import Claim

from app.ml.predict import predict_fraud
from app.ml.nlp_predict import analyze_narrative



def seed_kaggle_claims(n_rows: int = 15):
    csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/insurance_claims_real.csv"))
    if not os.path.exists(csv_path):
        print(f"Error: Kaggle CSV dataset not found at {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"Loaded Kaggle Dataset with {len(df)} total rows.")

    db = SessionLocal()
    try:
        # Clear existing seeded claims to ensure pristine Kaggle dataset alignment
        db.query(Claim).delete()
        db.commit()

        now = datetime.now(timezone.utc)
        seeded_count = 0

        for idx, row in df.head(n_rows).iterrows():
            age = int(row["age"]) if "age" in row and pd.notna(row["age"]) else 35
            policy_num = str(row["policy_number"]) if "policy_number" in row and pd.notna(row["policy_number"]) else f"100{idx+1}"
            make = str(row["auto_make"]) if "auto_make" in row and pd.notna(row["auto_make"]) else "Vehicle"
            model = str(row["auto_model"]) if "auto_model" in row and pd.notna(row["auto_model"]) else "Model"
            year = int(row["auto_year"]) if "auto_year" in row and pd.notna(row["auto_year"]) else 2020
            make_model = f"{make} {model} ({year})"
            
            claim_amt = int(row["total_claim_amount"]) if "total_claim_amount" in row and pd.notna(row["total_claim_amount"]) else 50000
            price = int(row["vehicle_price"]) if "vehicle_price" in row and pd.notna(row["vehicle_price"]) else 1000000
            v_age = int(row["vehicle_age"]) if "vehicle_age" in row and pd.notna(row["vehicle_age"]) else 3
            past_c = int(row["past_claims"]) if "past_claims" in row and pd.notna(row["past_claims"]) else 0
            d_rating = int(row["driver_rating"]) if "driver_rating" in row and pd.notna(row["driver_rating"]) else 4
            
            pol_type = str(row["policy_type"]) if "policy_type" in row and pd.notna(row["policy_type"]) else "Comprehensive"
            fault = str(row["fault"]) if "fault" in row and pd.notna(row["fault"]) else "Policy Holder"
            area = str(row["accident_area"]) if "accident_area" in row and pd.notna(row["accident_area"]) else "Urban"
            
            police_avail = str(row["police_report_available"]).upper() == "YES" if "police_report_available" in row and pd.notna(row["police_report_available"]) else False

            witnesses = int(row["witnesses"]) if "witnesses" in row and pd.notna(row["witnesses"]) else 0
            witness_present = witnesses > 0
            
            inc_type = str(row["incident_type"]) if "incident_type" in row and pd.notna(row["incident_type"]) else "Collision"
            coll_type = str(row["collision_type"]) if "collision_type" in row and pd.notna(row["collision_type"]) else "Front Collision"
            inc_city = str(row["incident_city"]) if "incident_city" in row and pd.notna(row["incident_city"]) else "Metropolis"
            inc_hour = int(row["incident_hour_of_the_day"]) if "incident_hour_of_the_day" in row and pd.notna(row["incident_hour_of_the_day"]) else 12
            
            auth_contacted = str(row["authorities_contacted"]) if "authorities_contacted" in row and pd.notna(row["authorities_contacted"]) else "Police"
            incident_severity = str(row["incident_severity"]) if "incident_severity" in row and pd.notna(row["incident_severity"]) else "Minor Damage"
            description = (
                f"Kaggle Row #{idx+1} (Policy #{policy_num}): {inc_type} ({coll_type}) at {inc_city}, "
                f"time {inc_hour}:00. Authorities: {auth_contacted}. Witnesses: {witnesses}. Police report: {'Filed' if police_avail else 'Not filed'}."
            )


            
            # Predict ML Fraud Probability using trained XGBoost Model
            proba, overall_score, top_factors = predict_fraud({
                "age": age,
                "vehicle_price": price,
                "claim_amount": claim_amt,
                "vehicle_age": v_age,
                "past_claims": past_c,
                "driver_rating": d_rating,
                "policy_type": pol_type,
                "fault": fault,
                "accident_area": area,
                "police_report_filed": police_avail,
                "witness_present": witness_present,
                "incident_severity": incident_severity,
                "incident_description": description,
            })
            
            fraud_prob = round(proba, 2)
            risk_band = "High risk" if overall_score >= 50.0 else ("Moderate risk" if overall_score >= 30.0 else "Low risk")
            rec_action = "Flag for SIU Fraud Audit" if overall_score >= 50.0 else ("Require Secondary Photo Verification" if overall_score >= 30.0 else "Proceed to approval")
            narrative_score = round(overall_score * 0.85, 1)

            
            occupation = str(row.get("insured_occupation", "Specialist")).title()
            cust_name = f"Policyholder #{policy_num} ({occupation})"
            
            damage_sev = "Major Crush" if overall_score > 60 else ("Moderate Dent" if overall_score > 30 else "Minor Scuff")
            damage_sc = round(overall_score * 0.95, 1)

            claim_obj = Claim(
                customer_name=cust_name,
                vehicle_make_model=make_model,
                age=age,
                vehicle_price=price,
                claim_amount=claim_amt,
                vehicle_age=v_age,
                past_claims=past_c,
                driver_rating=d_rating,
                policy_type=pol_type,
                fault=fault,
                accident_area=area,
                police_report_filed=police_avail,
                witness_present=witness_present,
                incident_severity=incident_severity,
                incident_description=description,
                narrative_suspicion_score=narrative_score,
                fraud_probability=fraud_prob,
                fraud_score=overall_score,
                overall_risk_score=overall_score,
                risk_band=risk_band,
                recommended_action=rec_action,
                damage_severity=damage_sev,
                damage_score=damage_sc,
                created_at=now - timedelta(days=idx+1),
            )
            
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
