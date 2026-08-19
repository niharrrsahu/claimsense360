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

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClaimSense360 API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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