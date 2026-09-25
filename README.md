# ClaimSense 360 — AI-Powered Multi-Modal Claims Fraud & Damage Inspection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%20%2B%20SHAP-orange.svg)](https://xgboost.readthedocs.io/)
[![YOLOv8](https://img.shields.io/badge/CV-Ultralytics%20YOLOv8-blueviolet.svg)](https://ultralytics.com/)
[![PyTest](https://img.shields.io/badge/Tests-18%2F18%20Passing-success.svg)](https://docs.pytest.org/)

ClaimSense 360 is an enterprise-grade, multi-modal automated insurance claims processing and fraud detection system designed for claims adjusters and Special Investigation Units (SIU).

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                  │
│       (Tailwind CSS v4, Lucide Icons, Framer Motion)   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / Bearer JWT
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│      (SQLAlchemy, SQLite / PostgreSQL, Pydantic v2)    │
└───────┬───────────────────┬───────────────────┬────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│ XGBoost + SHAP │  │  TF-IDF + LogR │  │ YOLOv8+ResNet18│
│ Tabular Fraud  │  │ Narrative NLP  │  │ Computer Vision│
│   (ROC: 0.754) │  │ Deception Det. │  │ Damage Analysis│
└────────────────┘  └────────────────┘  └────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Google Gemini  │
                    │   AI Copilot   │
                    └────────────────┘
```

---

## 🧠 Machine Learning & AI Pipelines

### 1. XGBoost Tabular Fraud Classifier & SHAP Explainability
- **Dataset**: Real-world 1,000-record Kaggle Auto Insurance Claims dataset (`backend/app/data/insurance_claims_real.csv`).
- **Features**: Includes standard underwriting features (`age`, `vehicle_price`, `claim_amount`, `vehicle_age`, `past_claims`, `driver_rating`, `policy_type`, `fault`, `accident_area`, `police_report_filed`, `witness_present`) plus **`incident_severity`** (`Trivial Damage`, `Minor Damage`, `Major Damage`, `Total Loss`).
- **Validation**:
  - Accuracy: **76.50%**
  - ROC-AUC: **0.7542**
  - 5-Fold Stratified Cross-Validation: **75.25% (±2.11%)**
- **Explainability**: Full `shap.TreeExplainer` attribution calculating individual positive and negative contributions for every submitted claim.

### 2. NLP Narrative Deception Classifier
- **Model**: Scikit-Learn TF-IDF N-gram Vectorizer (unigrams + bigrams) paired with L2-regularized Logistic Regression (`backend/app/ml/nlp_predict.py`).
- **Function**: Analyzes claimant statement linguistic patterns (vagueness, excessive urgency, hedging vs. specific timelines, officer badges, and calm factual descriptions).

### 3. Computer Vision Damage Severity Engine & Digital Forensics
- **Detection**: Ultralytics YOLOv8 object detection paired with PyTorch ResNet-18 deep feature extraction and spatial edge-density gradient analysis (`backend/app/ml/damage_analysis.py`).
- **Anti-Spoofing & Forensics**: Extracts live EXIF metadata from uploaded imagery to verify genuine mobile camera telemetry and flags web-downloaded stock imagery.

### 4. Interactive Claims Intelligence Copilot
- Context-aware AI assistant powered by Google Gemini / Claude models with live access to high-risk claims, financial exposure analytics, and claim audit trails (`backend/app/services/copilot_service.py`).

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Backend (`backend/.env`)
```env
PORT=8000
JWT_SECRET_KEY=your_secure_random_jwt_secret_key_here
DATABASE_URL=sqlite:///./claimsense360.db
FRONTEND_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,https://claimsense360.vercel.app
GEMINI_API_KEY=your_google_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key_optional
```

---

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt -r requirements-ml.txt

# Retrain ML models locally:
python app/ml/train_fraud_model.py
python app/ml/train_narrative_model.py

# Run backend development server:
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)
```bash
# In the root repository:
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

The platform features an automated PyTest test suite testing authentication, authorization, claim risk scoring, and image handling:

```bash
cd backend
python -m pytest tests/
```
**Status: 18 / 18 tests passing (100%)**.

---

## 🚢 Deployment

- **Frontend**: Deployable on **Vercel** via Next.js standard edge runtime.
- **Backend**: Containerized via `backend/Dockerfile` and deployable on **Railway** / **Render** / **AWS ECS**.
- **Database**: SQLite for development, PostgreSQL for production.
