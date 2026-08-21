from datetime import datetime
from typing import Literal, Any
from pydantic import BaseModel, Field

class ClaimInput(BaseModel):
    customer_name: str | None = None
    vehicle_make_model: str | None = None
    age: int = Field(ge=18, le=100)
    vehicle_price: int = Field(ge=10_000, le=20_000_000)
    claim_amount: int = Field(ge=0, le=20_000_000)
    vehicle_age: int = Field(ge=0, le=40)
    past_claims: int = Field(ge=0, le=20)
    driver_rating: int = Field(ge=1, le=5)
    policy_type: Literal["Third-Party", "Comprehensive", "Zero-Dep"]
    fault: Literal["Policy Holder", "Third Party"]
    accident_area: Literal["Urban", "Rural", "Highway"]
    police_report_filed: bool
    witness_present: bool
    incident_severity: Literal["Trivial Damage", "Minor Damage", "Major Damage", "Total Loss"] = "Minor Damage"
    incident_description: str | None = Field(default=None, max_length=4000)

class FraudFactor(BaseModel):
    feature: str
    name: str
    contribution: float
    effect: str

class DamageResult(BaseModel):
    damage_score: float
    damage_severity: str
    method: str = "heuristic-cv"
    details: dict[str, Any] | None = None
    has_exif: bool | None = None
    is_web_asset: bool | None = None
    forensic_status: str | None = None
    forensic_warning: str | None = None


class FlaggedPhrase(BaseModel):
    phrase: str
    impact: float
    effect: str

class NarrativeResult(BaseModel):
    suspicion_score: float
    label: str
    flagged_phrases: list[FlaggedPhrase]

class ClaimAnalysisResult(BaseModel):
    claim_id: int | None = None
    fraud_probability: float
    fraud_score: float              # 0-100, from the XGBoost model alone
    overall_risk_score: float       # 0-100, blended with narrative score if present
    risk_band: str                  # "Low risk" | "Medium risk" | "High risk"
    recommended_action: str         # "Approve automatically" | "Send to investigator" | "High-priority investigation"
    top_factors: list[FraudFactor]  # SHAP-derived
    damage: DamageResult | None = None
    narrative: NarrativeResult | None = None

class ClaimResponse(BaseModel):
    id: int
    user_id: int | None
    customer_name: str | None
    vehicle_make_model: str | None
    age: int
    vehicle_price: int
    claim_amount: int
    vehicle_age: int
    past_claims: int
    driver_rating: int
    policy_type: str
    fault: str
    accident_area: str
    police_report_filed: bool
    witness_present: bool
    incident_severity: str = "Minor Damage"
    incident_description: str | None
    narrative_suspicion_score: float | None
    fraud_probability: float
    fraud_score: float
    overall_risk_score: float
    risk_band: str
    recommended_action: str
    damage_severity: str | None
    damage_score: float | None
    image_data: str | None = None
    image_path: str | None = None
    is_seed: bool = False
    forensic_penalty: float = 0.0
    created_at: datetime
    top_factors: list[FraudFactor] | None = None


    class Config:
        from_attributes = True

class LabelCount(BaseModel):
    label: str
    count: int

class MonthCount(BaseModel):
    month: str
    claims: int

class ClaimsSummaryStats(BaseModel):
    total_claims: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    avg_risk_score: float
    avg_claim_amount: int
    claims_by_month: list[MonthCount]
    policy_type_breakdown: list[LabelCount]
    fault_breakdown: list[LabelCount]
    accident_area_breakdown: list[LabelCount]
