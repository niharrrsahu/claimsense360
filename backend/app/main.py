import os
import sys

# Memory optimization for 512MB RAM cloud instances
os.environ["MALLOC_TRIM_THRESHOLD_"] = "100000"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.api.auth import router as auth_router
from app.api.claims import router as claims_router
from app.api.copilot import router as copilot_router

from app.database.database import engine, Base
import app.models  # load models

from sqlalchemy import text

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Auto-migrate missing columns for existing PostgreSQL / SQLite databases
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE claims ADD COLUMN IF NOT EXISTS image_path VARCHAR;"))
        conn.execute(text("ALTER TABLE claims ADD COLUMN IF NOT EXISTS is_seed BOOLEAN DEFAULT FALSE;"))
        conn.execute(text("ALTER TABLE claims ADD COLUMN IF NOT EXISTS forensic_penalty FLOAT DEFAULT 0.0;"))
        conn.execute(text("ALTER TABLE claims ADD COLUMN IF NOT EXISTS incident_severity VARCHAR DEFAULT 'Minor Damage';"))
except Exception as migration_err:
    print(f"Auto-migration notice: {migration_err}")


app = FastAPI(
    title="ClaimSense360 API",
    version="1.0.0",
)

# CORS
# Wildcard origins ("*") combined with allow_credentials=True lets any website on the
# internet make credentialed requests to this API using a leaked/stolen bearer token.
# Restrict to the real frontend origin(s) via an env var instead.
_frontend_origins = os.environ.get("FRONTEND_ORIGIN", "").split(",")
_frontend_origins = [o.strip() for o in _frontend_origins if o.strip()]
if not _frontend_origins:
    print("WARNING: FRONTEND_ORIGIN env var not set — CORS will not allow any browser origin.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import os
from fastapi.staticfiles import StaticFiles

app.include_router(auth_router)
app.include_router(claims_router)
app.include_router(copilot_router)

# Mount Static Uploads Folder
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")




@app.get("/")
def home():
    return {
        "message": "Welcome to ClaimSense360 Backend"
    }


@app.get("/health")
def health():
    return {
        "status": "Backend Running Successfully"
    }