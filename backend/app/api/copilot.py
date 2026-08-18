from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.services.copilot_service import ask_copilot

router = APIRouter(
    prefix="/copilot",
    tags=["AI Copilot"],
)

class CopilotRequest(BaseModel):
    question: str
    claim_id: int | None = None

class CopilotResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=CopilotResponse)
def ask_copilot_endpoint(
    req: CopilotRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        ans = ask_copilot(db=db, question=req.question, claim_id=req.claim_id)
        return CopilotResponse(answer=ans)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI Copilot request failed: {exc}"
        )

