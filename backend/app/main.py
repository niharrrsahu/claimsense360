from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.claims import router as claims_router
from app.api.copilot import router as copilot_router

app = FastAPI(
    title="ClaimSense360 API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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