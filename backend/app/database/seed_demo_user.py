import os
import sys

# Ensure root directory is on PYTHONPATH when executed as script
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.database.session import SessionLocal
from app.database.init_db import init_db
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.core.security import hash_password
from app.models.user import User

def seed_demo_user():
    init_db()
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@claimsense.ai").first()
        if existing:
            existing.password = hash_password("password123")
            db.commit()
            print("Demo user admin@claimsense.ai password reset to password123 successfully.")
            return existing
        
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
        return user
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_user()
