from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from app.database.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    customer_name = Column(String, nullable=True)
    vehicle_make_model = Column(String, nullable=True)
    
    age = Column(Integer, nullable=False)
    vehicle_price = Column(Integer, nullable=False)
    claim_amount = Column(Integer, nullable=False)
    vehicle_age = Column(Integer, nullable=False)
    past_claims = Column(Integer, nullable=False)
    driver_rating = Column(Integer, nullable=False)
    policy_type = Column(String, nullable=False)
    fault = Column(String, nullable=False)
    accident_area = Column(String, nullable=False)
    police_report_filed = Column(Boolean, default=False)
    witness_present = Column(Boolean, default=False)
    incident_description = Column(Text, nullable=True)
    
    narrative_suspicion_score = Column(Float, nullable=True)
    fraud_probability = Column(Float, nullable=False)
    fraud_score = Column(Float, nullable=False)
    overall_risk_score = Column(Float, nullable=False)
    risk_band = Column(String, nullable=False)
    recommended_action = Column(String, nullable=False)
    
    damage_severity = Column(String, nullable=True)
    damage_score = Column(Float, nullable=True)
    image_data = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

