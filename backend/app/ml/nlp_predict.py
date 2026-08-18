"""
NLP Narrative Suspicion Inference & Key Phrase Analyzer
"""

import os
import functools
import joblib
import numpy as np

@functools.lru_cache(maxsize=1)
def load_narrative_artifacts():
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ml_models"))
    model_path = os.path.join(models_dir, "narrative_model.joblib")
    vec_path = os.path.join(models_dir, "narrative_vectorizer.joblib")
    
    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        raise FileNotFoundError("Narrative ML artifacts missing. Run train_narrative_model.py first.")
        
    model = joblib.load(model_path)
    vectorizer = joblib.load(vec_path)
    return model, vectorizer

def analyze_narrative(text: str | None) -> dict | None:
    if not text or not text.strip():
        return None
        
    model, vectorizer = load_narrative_artifacts()
    
    vec_matrix = vectorizer.transform([text])
    proba = float(model.predict_proba(vec_matrix)[0, 1])
    suspicion_score = round(proba * 100, 1)
    
    # Feature names and coefficients
    feature_names = np.array(vectorizer.get_feature_names_out())
    coefs = model.coef_[0]
    
    # Non-zero indices in TF-IDF matrix for this text
    row_indices, col_indices = vec_matrix.nonzero()
    
    flagged_phrases = []
    for col_idx in col_indices:
        tfidf_val = vec_matrix[0, col_idx]
        word = feature_names[col_idx]
        coef = coefs[col_idx]
        impact = tfidf_val * coef
        
        if abs(impact) > 0.02:
            flagged_phrases.append({
                "phrase": word,
                "impact": round(float(impact), 3),
                "effect": "increases_suspicion" if impact > 0 else "lowers_suspicion"
            })
            
    # Sort flagged phrases by absolute impact
    flagged_phrases = sorted(flagged_phrases, key=lambda x: abs(x["impact"]), reverse=True)[:8]
    
    label = "Suspicious" if suspicion_score >= 50.0 else "Genuine"
    
    return {
        "suspicion_score": suspicion_score,
        "label": label,
        "flagged_phrases": flagged_phrases
    }
