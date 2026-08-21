from app.database.database import Base, engine
from app.database.session import SessionLocal
from app.models.user import User
from app.models.claim import Claim
from app.core.security import hash_password


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@claimsense.ai").first()
        if not admin_user:
            admin = User(
                full_name="ClaimSense Admin",
                email="admin@claimsense.ai",
                password=hash_password("password123"),
                role="Admin"
            )
            db.add(admin)
            db.commit()
            print("Auto-created default admin user admin@claimsense.ai!")
    except Exception as e:
        print(f"Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    print("Database tables created successfully!")