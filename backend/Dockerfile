FROM python:3.12-slim

WORKDIR /app

# Install system runtime dependencies required by XGBoost & OpenCV/PIL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements-ml.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-ml.txt

COPY app/ ./app/

# Train both ML models at image build time (fully offline, synthetic in-process)
RUN python -m app.ml.train_fraud_model && python -m app.ml.train_narrative_model

EXPOSE 8000

CMD ["sh", "-c", "python -m app.database.seed_demo_user && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

