import base64
import os
import uuid
import math
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.claim import Claim
from app.schemas.claim import (
    ClaimInput,
    ClaimAnalysisResult,
    FraudFactor,
    DamageResult,
    NarrativeResult,
    ClaimsSummaryStats,
    MonthCount,
    LabelCount,
)
from app.ml.predict import predict_fraud
from app.ml.nlp_predict import analyze_narrative
from app.ml.damage_analysis import analyze_damage_image

NARRATIVE_WEIGHT = 0.25

def seed_initial_claims_if_empty(db: Session):
    """
    Auto-seeds 6 authentic Kaggle dataset claim records into SQLite database if empty,
    ensuring 1:1 mathematical harmony across dashboard stats, directory, and damage cards.
    """
    if db.query(Claim).count() > 0:
        return

    now = datetime.now(timezone.utc)
    initial_claims = [
        Claim(
            customer_name="Policyholder #521585 (Craft Repair)",
            vehicle_make_model="Saab 92x (2004)",
            age=48,
            vehicle_price=850000,
            claim_amount=71610,
            vehicle_age=11,
            past_claims=2,
            driver_rating=2,
            policy_type="Comprehensive",
            fault="Policy Holder",
            accident_area="Urban",
            police_report_filed=True,
            witness_present=True,
            incident_description="Kaggle Row #1: Single Vehicle Collision with Side Impact at Columbus, 5 AM (Incident Severity: Major Damage). Structural front bumper & side frame crushing reported.",
            narrative_suspicion_score=78.0,
            fraud_probability=0.82,
            fraud_score=82.0,
            overall_risk_score=82.0,
            risk_band="High risk",
            recommended_action="Flag for SIU Fraud Audit",
            incident_severity="Major Damage",
            damage_severity="Major Crush",
            damage_score=82.5,
            is_seed=True,
            created_at=now - timedelta(days=1),
        ),
        Claim(
            customer_name="Policyholder #342868 (Machine Inspector)",
            vehicle_make_model="Mercedes E400 (2007)",
            age=42,
            vehicle_price=620000,
            claim_amount=5070,
            vehicle_age=8,
            past_claims=0,
            driver_rating=4,
            policy_type="Third-Party",
            fault="Third Party",
            accident_area="Urban",
            police_report_filed=True,
            witness_present=False,
            incident_description="Kaggle Row #2: Vehicle Theft report at Riverwood, 8 AM (Incident Severity: Minor Damage). Door lock tamper and window glass scuff.",
            narrative_suspicion_score=10.0,
            fraud_probability=0.12,
            fraud_score=12.0,
            overall_risk_score=12.0,
            risk_band="Low risk",
            recommended_action="Fast-track 3-Second Settlement",
            incident_severity="Minor Damage",
            damage_severity="Minor Scuff",
            damage_score=12.0,
            is_seed=True,
            created_at=now - timedelta(days=3),
        ),
        Claim(
            customer_name="Policyholder #687698 (Sales Executive)",
            vehicle_make_model="Dodge RAM (2007)",
            age=29,
            vehicle_price=450000,
            claim_amount=34650,
            vehicle_age=8,
            past_claims=1,
            driver_rating=5,
            policy_type="Comprehensive",
            fault="Policy Holder",
            accident_area="Urban",
            police_report_filed=False,
            witness_present=True,
            incident_description="Kaggle Row #3: Multi-vehicle rear collision at Columbus city intersection, 7 AM (Incident Severity: Minor Damage).",
            narrative_suspicion_score=20.0,
            fraud_probability=0.24,
            fraud_score=24.0,
            overall_risk_score=24.0,
            risk_band="Low risk",
            recommended_action="Proceed to Standard Approval",
            incident_severity="Minor Damage",
            damage_severity="Minor Bumper Scuff",
            damage_score=22.0,
            is_seed=True,
            created_at=now - timedelta(days=5),
        ),
        Claim(
            customer_name="Policyholder #227811 (Armed Forces)",
            vehicle_make_model="Chevrolet Tahoe (2014)",
            age=41,
            vehicle_price=1250000,
            claim_amount=63400,
            vehicle_age=1,
            past_claims=3,
            driver_rating=2,
            policy_type="Comprehensive",
            fault="Policy Holder",
            accident_area="Highway",
            police_report_filed=False,
            witness_present=True,
            incident_description="Kaggle Row #4: Single Vehicle Front Collision at Arlington highway, 5 AM (Incident Severity: Major Damage). Severe radiator & bonnet destruction.",
            narrative_suspicion_score=72.0,
            fraud_probability=0.76,
            fraud_score=76.0,
            overall_risk_score=76.0,
            risk_band="High risk",
            recommended_action="Flag for SIU Fraud Audit",
            incident_severity="Major Damage",
            damage_severity="Heavy Crash",
            damage_score=75.0,
            is_seed=True,
            created_at=now - timedelta(days=8),
        ),
        Claim(
            customer_name="Policyholder #443302 (Tech Support)",
            vehicle_make_model="Acura RSX (2009)",
            age=44,
            vehicle_price=320000,
            claim_amount=6500,
            vehicle_age=6,
            past_claims=0,
            driver_rating=4,
            policy_type="Third-Party",
            fault="Policy Holder",
            accident_area="Urban",
            police_report_filed=False,
            witness_present=False,
            incident_description="Kaggle Row #5: Vehicle Theft report at Arlington parking lot, 8 PM (Incident Severity: Minor Damage). Window glass tamper.",
            narrative_suspicion_score=12.0,
            fraud_probability=0.15,
            fraud_score=15.0,
            overall_risk_score=15.0,
            risk_band="Low risk",

            recommended_action="Fast-track Automatic Payout",
            incident_severity="Trivial Damage",
            damage_severity="Minor Scuff",
            damage_score=15.0,
            is_seed=True,
            created_at=now - timedelta(days=12),
        ),
        Claim(
            customer_name="Policyholder #638895 (Research Tech)",
            vehicle_make_model="Saab 95 (2003)",
            age=39,
            vehicle_price=980000,
            claim_amount=64100,
            vehicle_age=12,
            past_claims=2,
            driver_rating=1,
            policy_type="Comprehensive",
            fault="Policy Holder",
            accident_area="Rural",
            police_report_filed=False,
            witness_present=True,
            incident_description="Kaggle Row #6: Multi-vehicle rear collision at Arlington, 7 PM (Incident Severity: Major Damage). Heavy rear bumper frame crush.",
            narrative_suspicion_score=75.0,
            fraud_probability=0.79,
            fraud_score=79.0,
            overall_risk_score=79.0,
            risk_band="High risk",
            recommended_action="Flag for SIU Fraud Audit",
            incident_severity="Major Damage",
            damage_severity="Heavy Rear Collision",
            damage_score=78.0,
            is_seed=True,
            created_at=now - timedelta(days=15),
        ),

    ]

    try:
        db.add_all(initial_claims)
        db.commit()
        print("Successfully auto-seeded 6 initial Kaggle dataset claim records into database!")
    except Exception as e:
        print(f"Warning seeding claims: {e}")
        db.rollback()




def analyze_and_save_claim(
    db: Session,
    claim_input: ClaimInput,
    image_bytes: bytes | None = None,
    user_id: int | None = None
) -> ClaimAnalysisResult:
    # 1. Run XGBoost Fraud Model
    claim_dict = claim_input.model_dump()
    fraud_prob, fraud_score, top_factors_raw = predict_fraud(claim_dict)
    
    top_factors = [FraudFactor(**f) for f in top_factors_raw]
    
    # 2. Run NLP Narrative Model if description provided
    narrative_res = None
    narrative_score = None
    if claim_input.incident_description and claim_input.incident_description.strip():
        raw_narrative = analyze_narrative(claim_input.incident_description)
        if raw_narrative:
            narrative_score = raw_narrative["suspicion_score"]
            narrative_res = NarrativeResult(**raw_narrative)
            
    # 3. Blend Scores
    if narrative_score is not None:
        overall_risk_score = round(
            (1.0 - NARRATIVE_WEIGHT) * fraud_score + NARRATIVE_WEIGHT * narrative_score, 1
        )
    else:
        overall_risk_score = fraud_score
        
    overall_risk_score = max(0.0, min(100.0, overall_risk_score))
    
    # 4. Decision Thresholds
    if overall_risk_score < 30.0:
        risk_band = "Low risk"
        recommended_action = "Approve automatically"
    elif overall_risk_score < 50.0:
        risk_band = "Medium risk"
        recommended_action = "Send to investigator"
    else:
        risk_band = "High risk"
        recommended_action = "High-priority investigation"
        
    # 5. Run Damage Severity CV Analysis if image provided
    damage_res = None
    damage_severity_str = None
    damage_score_val = None
    image_b64_str = None
    image_file_path = None
    forensic_penalty_val = 0.0
    
    if image_bytes:
        raw_damage = analyze_damage_image(image_bytes)
        if raw_damage:
            damage_severity_str = raw_damage["damage_severity"]
            damage_score_val = raw_damage["damage_score"]
            damage_res = DamageResult(**raw_damage)

            # Digital Image Forensics Anti-Spoofing Check
            if raw_damage.get("is_web_asset") or not raw_damage.get("has_exif"):
                forensic_penalty_val = 18.5
                overall_risk_score = min(98.0, round(overall_risk_score + forensic_penalty_val, 1))

                top_factors.insert(0, FraudFactor(
                    feature="image_forensics",
                    name="Image Forensics (Missing EXIF / Web Asset)",
                    contribution=1.850,
                    effect="increases_risk"
                ))

                if overall_risk_score >= 50.0:
                    risk_band = "High risk"
                    recommended_action = "Flag for SIU Fraud Audit & Digital Forensics"

        try:
            # Save image locally to disk to prevent database bloat
            uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
            os.makedirs(uploads_dir, exist_ok=True)
            filename = f"damage_{uuid.uuid4().hex[:8]}.jpg"
            full_path = os.path.join(uploads_dir, filename)
            with open(full_path, "wb") as f:
                f.write(image_bytes)
            image_file_path = f"/uploads/{filename}"
            # Clean disk storage - do NOT write megabytes of base64 data to DB
            image_b64_str = None
        except Exception as e:
            print(f"Warning saving upload image file: {e}")
            try:
                image_b64_str = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode('utf-8')}"
            except Exception:
                pass

            
    # 6. Save DB record wrapped in try/except for resilience
    claim_id = None
    try:
        cust_name = claim_input.customer_name or "Anonymous Customer"
        veh_name = claim_input.vehicle_make_model or "Vehicle Details Unspecified"
        
        db_claim = Claim(
            user_id=user_id,
            customer_name=cust_name,
            vehicle_make_model=veh_name,
            age=claim_input.age,
            vehicle_price=claim_input.vehicle_price,
            claim_amount=claim_input.claim_amount,
            vehicle_age=claim_input.vehicle_age,
            past_claims=claim_input.past_claims,
            driver_rating=claim_input.driver_rating,
            policy_type=claim_input.policy_type,
            fault=claim_input.fault,
            accident_area=claim_input.accident_area,
            police_report_filed=claim_input.police_report_filed,
            witness_present=claim_input.witness_present,
            incident_severity=claim_input.incident_severity,
            incident_description=claim_input.incident_description,
            narrative_suspicion_score=narrative_score,
            fraud_probability=fraud_prob,
            fraud_score=fraud_score,
            overall_risk_score=overall_risk_score,
            risk_band=risk_band,
            recommended_action=recommended_action,
            damage_severity=damage_severity_str,
            damage_score=damage_score_val,
            image_data=None,
            image_path=image_file_path,
            is_seed=False,
            forensic_penalty=forensic_penalty_val,
        )
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        claim_id = db_claim.id
    except Exception as exc:
        print(f"Warning: Failed to persist claim to DB: {exc}")
        db.rollback()
        
    return ClaimAnalysisResult(
        claim_id=claim_id,
        fraud_probability=fraud_prob,
        fraud_score=fraud_score,
        overall_risk_score=overall_risk_score,
        risk_band=risk_band,
        recommended_action=recommended_action,
        top_factors=top_factors,
        damage=damage_res,
        narrative=narrative_res
    )

def get_claims_history(db: Session, limit: int = 50, query: str | None = None, exclude_seed: bool = False):
    seed_initial_claims_if_empty(db)
    q = db.query(Claim)
    if exclude_seed:
        q = q.filter(Claim.is_seed == False)
    if query and query.strip():
        term = f"%{query.strip()}%"
        q = q.filter(
            (Claim.customer_name.ilike(term)) | (Claim.vehicle_make_model.ilike(term)) | (Claim.incident_description.ilike(term))
        )
    return q.order_by(Claim.created_at.desc()).limit(limit).all()

def get_high_risk_claims(db: Session, limit: int = 50, exclude_seed: bool = False):
    seed_initial_claims_if_empty(db)
    q = db.query(Claim)
    if exclude_seed:
        q = q.filter(Claim.is_seed == False)
    return (
        q.filter(
            or_(
                Claim.overall_risk_score >= 50.0,
                Claim.risk_band.ilike("%high%")
            )
        )
        .order_by(Claim.overall_risk_score.desc())
        .limit(limit)
        .all()
    )

def get_claim_by_id(db: Session, claim_id: int):
    seed_initial_claims_if_empty(db)
    return db.query(Claim).filter(Claim.id == claim_id).first()

def get_claims_summary_stats(db: Session, exclude_seed: bool = False) -> ClaimsSummaryStats:
    seed_initial_claims_if_empty(db)
    q_base = db.query(Claim)
    if exclude_seed:
        q_base = q_base.filter(Claim.is_seed == False)
    total_claims = q_base.count()


    if total_claims == 0:
        return ClaimsSummaryStats(
            total_claims=0,
            high_risk_count=0,
            medium_risk_count=0,
            low_risk_count=0,
            avg_risk_score=0.0,
            avg_claim_amount=0,
            claims_by_month=[],
            policy_type_breakdown=[],
            fault_breakdown=[],
            accident_area_breakdown=[]
        )
        
    high_risk_count = q_base.filter(
        or_(Claim.overall_risk_score >= 50.0, Claim.risk_band.ilike("%high%"))
    ).count()
    
    medium_risk_count = q_base.filter(
        Claim.overall_risk_score >= 30.0,
        Claim.overall_risk_score < 50.0
    ).count()
    
    low_risk_count = q_base.filter(
        Claim.overall_risk_score < 30.0
    ).count()
    
    avg_score = q_base.with_entities(func.avg(Claim.overall_risk_score)).scalar() or 0.0
    avg_amount = q_base.with_entities(func.avg(Claim.claim_amount)).scalar() or 0.0
    
    # Policy type breakdown
    policy_counts = (
        q_base.with_entities(Claim.policy_type, func.count(Claim.id))
        .group_by(Claim.policy_type)
        .all()
    )

    policy_breakdown = [LabelCount(label=p, count=c) for p, c in policy_counts]
    
    # Fault breakdown
    fault_counts = (
        db.query(Claim.fault, func.count(Claim.id))
        .group_by(Claim.fault)
        .all()
    )
    fault_breakdown = [LabelCount(label=f, count=c) for f, c in fault_counts]
    
    # Accident area breakdown
    area_counts = (
        db.query(Claim.accident_area, func.count(Claim.id))
        .group_by(Claim.accident_area)
        .all()
    )
    area_breakdown = [LabelCount(label=a, count=c) for a, c in area_counts]
    
    # Claims by month - Build trailing 6-month timeline up to current date (Aug 2026)
    now = datetime.now(timezone.utc)
    months_labels = []
    month_counts_dict = {}
    for i in range(5, -1, -1):
        m_date = now - timedelta(days=i*30)
        m_str = m_date.strftime("%b %Y")
        months_labels.append(m_str)
        month_counts_dict[m_str] = 0
        
    all_claims = db.query(Claim.created_at).all()
    for (c_date,) in all_claims:
        if c_date:
            m_key = c_date.strftime("%b %Y")
            if m_key in month_counts_dict:
                month_counts_dict[m_key] += 1
            else:
                month_counts_dict[m_key] = 1
                if m_key not in months_labels:
                    months_labels.append(m_key)
                    
    claims_by_month = [MonthCount(month=m, claims=month_counts_dict.get(m, 0)) for m in months_labels]
    
    return ClaimsSummaryStats(
        total_claims=total_claims,
        high_risk_count=high_risk_count,
        medium_risk_count=medium_risk_count,
        low_risk_count=low_risk_count,
        avg_risk_score=round(float(avg_score), 1),
        avg_claim_amount=int(round(float(avg_amount))),
        claims_by_month=claims_by_month,
        policy_type_breakdown=policy_breakdown,
        fault_breakdown=fault_breakdown,
        accident_area_breakdown=area_breakdown
    )

