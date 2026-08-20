import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status


from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.claim import (
    ClaimInput,
    ClaimAnalysisResult,
    ClaimResponse,
    ClaimsSummaryStats,
    FraudFactor
)
from app.services.claims_service import (
    analyze_and_save_claim,
    get_claims_history,
    get_high_risk_claims,
    get_claim_by_id,
    get_claims_summary_stats
)
from app.ml.predict import predict_fraud

router = APIRouter(
    prefix="/claims",
    tags=["Claims Intelligence"],
)

@router.get("/")
def claims_root():
    return {"message": "Claims API Working"}

@router.post("/analyze", response_model=ClaimAnalysisResult)
async def analyze_claim_endpoint(
    claim: str = Form(..., description="JSON string of ClaimInput"),
    image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        claim_data = json.loads(claim)
        claim_input = ClaimInput(**claim_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid JSON format for claim input: {e}"
        )
        
    image_bytes = None
    if image:
        image_bytes = await image.read()
        
    result = analyze_and_save_claim(
        db=db,
        claim_input=claim_input,
        image_bytes=image_bytes,
        user_id=current_user.id
    )
    return result

@router.get("/stats/summary", response_model=ClaimsSummaryStats)
def get_stats_summary_endpoint(
    exclude_seed: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_claims_summary_stats(db, exclude_seed=exclude_seed)

@router.get("/high-risk", response_model=list[ClaimResponse])
def get_high_risk_claims_endpoint(
    limit: int = 50,
    exclude_seed: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claims = get_high_risk_claims(db, limit=limit, exclude_seed=exclude_seed)
    res = []
    for c in claims:
        # Re-compute SHAP factors for detail response
        claim_dict = {
            "age": c.age,
            "vehicle_price": c.vehicle_price,
            "claim_amount": c.claim_amount,
            "vehicle_age": c.vehicle_age,
            "past_claims": c.past_claims,
            "driver_rating": c.driver_rating,
            "policy_type": c.policy_type,
            "fault": c.fault,
            "accident_area": c.accident_area,
            "police_report_filed": c.police_report_filed,
            "witness_present": c.witness_present
        }
        _, _, top_f = predict_fraud(claim_dict)
        top_factors_list = [FraudFactor(**f) for f in top_f]
        if getattr(c, "forensic_penalty", 0) > 0:
            top_factors_list.insert(0, FraudFactor(
                feature="image_forensics",
                name="Image Forensics (Missing EXIF / Web Asset)",
                contribution=1.850,
                effect="increases_risk"
            ))
        c_res = ClaimResponse.model_validate(c)
        c_res.top_factors = top_factors_list
        res.append(c_res)
    return res

@router.get("/history", response_model=list[ClaimResponse])
def get_claims_history_endpoint(
    limit: int = 50,
    q: str | None = None,
    exclude_seed: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claims = get_claims_history(db, limit=limit, query=q, exclude_seed=exclude_seed)

    res = []
    for c in claims:
        claim_dict = {
            "age": c.age,
            "vehicle_price": c.vehicle_price,
            "claim_amount": c.claim_amount,
            "vehicle_age": c.vehicle_age,
            "past_claims": c.past_claims,
            "driver_rating": c.driver_rating,
            "policy_type": c.policy_type,
            "fault": c.fault,
            "accident_area": c.accident_area,
            "police_report_filed": c.police_report_filed,
            "witness_present": c.witness_present
        }
        _, _, top_f = predict_fraud(claim_dict)
        top_factors_list = [FraudFactor(**f) for f in top_f]
        if getattr(c, "forensic_penalty", 0) > 0:
            top_factors_list.insert(0, FraudFactor(
                feature="image_forensics",
                name="Image Forensics (Missing EXIF / Web Asset)",
                contribution=1.850,
                effect="increases_risk"
            ))
        c_res = ClaimResponse.model_validate(c)
        c_res.top_factors = top_factors_list
        res.append(c_res)
    return res

@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim_by_id_endpoint(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    c = get_claim_by_id(db, claim_id)
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claim #{claim_id} not found"
        )
        
    claim_dict = {
        "age": c.age,
        "vehicle_price": c.vehicle_price,
        "claim_amount": c.claim_amount,
        "vehicle_age": c.vehicle_age,
        "past_claims": c.past_claims,
        "driver_rating": c.driver_rating,
        "policy_type": c.policy_type,
        "fault": c.fault,
        "accident_area": c.accident_area,
        "police_report_filed": c.police_report_filed,
        "witness_present": c.witness_present
    }
    _, _, top_f = predict_fraud(claim_dict)
    top_factors_list = [FraudFactor(**f) for f in top_f]
    if getattr(c, "forensic_penalty", 0) > 0:
        top_factors_list.insert(0, FraudFactor(
            feature="image_forensics",
            name="Image Forensics (Missing EXIF / Web Asset)",
            contribution=1.850,
            effect="increases_risk"
        ))
    c_res = ClaimResponse.model_validate(c)
    c_res.top_factors = top_factors_list
    return c_res

