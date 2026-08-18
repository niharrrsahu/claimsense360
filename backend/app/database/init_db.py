from app.database.database import Base, engine
from app.models.user import User
from app.models.claim import Claim


def init_db():
    Base.metadata.create_all(bind=engine)



if __name__ == "__main__":
    init_db()
    print("Database tables created successfully!")