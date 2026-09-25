"""
Train Deception Detection NLP Model on Synthetic Claims Narratives
"""

import os
import sys
import numpy as np

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.ml.generate_narrative_data import generate_synthetic_narratives


def train_narrative_model():
    print("Generating comprehensive synthetic narrative dataset (2,400 samples)...")
    df = generate_synthetic_narratives(n_samples_per_class=1200, seed=42)
    
    X = df["text"]
    y = df["label"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=4000,
        sublinear_tf=True,
        stop_words="english"
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    model = LogisticRegression(C=2.0, class_weight="balanced", random_state=42, max_iter=500)
    model.fit(X_train_vec, y_train)
    
    y_pred = model.predict(X_test_vec)
    y_proba = model.predict_proba(X_test_vec)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred)
    
    # 5-fold cross validation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train_vec, y_train, cv=skf, scoring="accuracy")
    cv_mean = float(np.mean(cv_scores))
    cv_std = float(np.std(cv_scores))
    
    print("==================================================")
    print("      CLAIM SENSE 360 - NLP DECEPTION EVALUATION  ")
    print("==================================================")
    print(f"  Accuracy Score:              {acc*100:.2f}%")
    print(f"  Precision Score:             {prec*100:.2f}%")
    print(f"  Recall Score:                {rec*100:.2f}%")
    print(f"  F1-Score:                    {f1*100:.2f}%")
    print(f"  ROC-AUC Score:               {roc_auc:.4f}")
    print(f"  5-Fold CV Accuracy:          {cv_mean*100:.2f}% (+/- {cv_std*100:.2f}%)")
    print(f"  Confusion Matrix:            TN={cm[0,0]}, FP={cm[0,1]}, FN={cm[1,0]}, TP={cm[1,1]}")
    print("==================================================")
    
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_models"))
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, "narrative_model.joblib"))
    joblib.dump(vectorizer, os.path.join(models_dir, "narrative_vectorizer.joblib"))
    print(f"Narrative model artifacts successfully saved to {models_dir}")
    
    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "roc_auc": roc_auc,
        "cv_accuracy_mean": cv_mean,
        "cv_accuracy_std": cv_std,
        "confusion_matrix": cm.tolist()
    }

if __name__ == "__main__":
    train_narrative_model()
