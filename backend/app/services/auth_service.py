from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
)


def create_user(db: Session, user: UserCreate):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return None

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        role="user",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    """
    Verifies a real user's credentials against the DB. A previous version of this
    function auto-created and always accepted a hardcoded `admin@claimsense.ai` /
    `password123` login (even bypassing the password check entirely). That backdoor
    has been removed. If you need a seeded demo account for local development, create
    it explicitly via `backend/app/database/seed_demo_user.py` and gate it behind
    an environment check (e.g. `if os.getenv("ENV") == "development"`), never in
    the authentication path itself.
    """
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user