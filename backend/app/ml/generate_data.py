"""
Synthetic Claims Data Generator
Note: No real labelled claims dataset exists in this project. We generate a realistic synthetic dataset
with a clear, learnable logistic-regression ground truth formula to train the fraud detection model.
"""

import numpy as np
import pandas as pd

def generate_synthetic_claims(n_samples: int = 8000, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    
    age = np.random.randint(18, 76, size=n_samples)
    
    # Vehicle price from ₹80,000 to ₹3,000,000
    vehicle_price = np.random.uniform(80000, 3000000, size=n_samples)
    
    # Vehicle age 0 to 20 years
    vehicle_age = np.random.randint(0, 21, size=n_samples)
    
    # Past claims: Poisson distribution capped at 10
    past_claims = np.minimum(np.random.poisson(lam=0.8, size=n_samples), 10)
    
    # Driver rating 1 to 5
    driver_rating = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.1, 0.15, 0.45, 0.2, 0.1])
    
    # Policy type, fault, accident area
    policy_type = np.random.choice(["Comprehensive", "Third-Party", "Zero-Dep"], size=n_samples, p=[0.6, 0.25, 0.15])
    fault = np.random.choice(["Policy Holder", "Third Party"], size=n_samples, p=[0.7, 0.3])
    accident_area = np.random.choice(["Urban", "Rural", "Highway"], size=n_samples, p=[0.55, 0.25, 0.20])
    
    # Police report & witness present
    police_report_filed = np.random.choice([True, False], size=n_samples, p=[0.65, 0.35])
    witness_present = np.random.choice([True, False], size=n_samples, p=[0.4, 0.6])
    
    # Claim amount: usually a fraction of vehicle price (0.05 to 0.45), with occasional inflated outliers
    ratio_base = np.random.uniform(0.05, 0.45, size=n_samples)
    outlier_mask = np.random.rand(n_samples) < 0.12
    ratio_base[outlier_mask] = np.random.uniform(0.65, 1.2, size=outlier_mask.sum())
    claim_amount = np.minimum(vehicle_price * ratio_base, 20000000)
    
    # Ground truth logistic formula
    claim_ratio = claim_amount / (vehicle_price + 1e-5)
    
    logit = (
        -2.3
        + 3.4 * claim_ratio
        + 0.035 * vehicle_age
        + 0.40 * past_claims
        + np.where(police_report_filed, -1.05, 0.85)
        + np.where(witness_present, -0.45, 0.40)
        - 0.14 * driver_rating
        + np.random.normal(0, 0.55, size=n_samples)
    )
    
    prob = 1.0 / (1.0 + np.exp(-logit))
    is_fraud = (np.random.rand(n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        "age": age,
        "vehicle_price": vehicle_price,
        "claim_amount": claim_amount,
        "vehicle_age": vehicle_age,
        "past_claims": past_claims,
        "driver_rating": driver_rating,
        "policy_type": policy_type,
        "fault": fault,
        "accident_area": accident_area,
        "police_report_filed": police_report_filed,
        "witness_present": witness_present,
        "is_fraud": is_fraud
    })
    
    return df

if __name__ == "__main__":
    df = generate_synthetic_claims()
    print(f"Generated {len(df)} rows. Fraud count: {df['is_fraud'].sum()} ({df['is_fraud'].mean():.2%})")
