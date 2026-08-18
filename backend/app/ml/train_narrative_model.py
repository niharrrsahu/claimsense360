"""
Train Deception Detection NLP Model on Synthetic Claims Narratives
"""

import os
import sys
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.ml.generate_narrative_data import generate_synthetic_narratives


def train_narrative_model():
    print("Generating synthetic narrative dataset...")
    df = generate_synthetic_narratives(n_samples_per_class=700, seed=42)
    
    X = df["text"]
    y = df["label"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2000,
        stop_words="english"
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    model = LogisticRegression(C=1.5, random_state=42)
    model.fit(X_train_vec, y_train)
    
    y_pred = model.predict(X_test_vec)
    y_proba = model.predict_proba(X_test_vec)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    
    print(f"Narrative Model Training Completed.")
    print(f"Accuracy: {acc:.4f}")
    print(f"ROC-AUC:  {roc_auc:.4f}")
    
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_models"))
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, "narrative_model.joblib"))
    joblib.dump(vectorizer, os.path.join(models_dir, "narrative_vectorizer.joblib"))
    print(f"Narrative artifacts successfully saved to {models_dir}")

if __name__ == "__main__":
    train_narrative_model()
