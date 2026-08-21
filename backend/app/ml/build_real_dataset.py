"""
Builds backend/app/data/insurance_claims_real.csv from the full 1000-row real-world
Kaggle "Auto Insurance Claims Fraud Detection" dataset (same dataset the original
19-row excerpt in this repo was sampled from).

WHY THIS SCRIPT EXISTS
----------------------
The previous `insurance_claims_real.csv` shipped with this repo contained only 19 rows.
Training XGBoost on 19 rows produces a model that has memorized those 19 examples —
it is not a statistically meaningful fraud classifier, regardless of how correct the
XGBoost + SHAP inference code is.

This script pulls in the full, real, labelled 1000-row dataset and maps it onto
ClaimSense360's feature schema:

  DIRECTLY REAL (taken verbatim from the labelled dataset — the strongest fraud signals):
    - age                  <- age
    - claim_amount         <- total_claim_amount
    - police_report_filed  <- police_report_available (YES -> True, NO/? -> False)
    - witness_present      <- witnesses > 0
    - incident_severity    <- incident_severity (Trivial/Minor/Major Damage, Total Loss)
    - is_fraud             <- fraud_reported (Y/N)   <-- the real ground-truth label

  NOTE ON A DELIBERATELY EXCLUDED COLUMN — `insured_hobbies`:
    In this specific public dataset, claims where insured_hobbies == "chess" or
    "cross-fit" are fraudulent ~75-83% of the time (see the correlation printed by
    the analysis this script's derivations were based on) — this is a well-known
    quirk/injected artifact of this particular teaching dataset, not a real-world
    fraud signal. A hobby is not a legitimate, fair, or defensible basis for fraud
    scoring in a real product, so it is intentionally NOT used here even though it
    is by far the single strongest predictor in the raw data. If you retrain this
    model, do not add "hobbies" as a feature no matter how good the metrics look —
    it would not generalize outside this specific dataset and would be an unfair,
    indefensible signal to use against real customers.
    `incident_severity`, by contrast, IS a legitimate, explainable, real-world
    concept — the size of the accident logically correlates with claim size and
    is standard in real underwriting — so it is included above.

  DERIVED FROM REAL FIELDS (grounded in real data, not fabricated):
    - vehicle_age          <- incident year (from incident_date) - auto_year

  SYNTHESIZED (the original Kaggle dataset does not contain these fields at all,
  because this app's schema uses India-specific concepts that don't exist in the
  US-centric source dataset — e.g. ₹ vehicle price, "Zero-Dep" policy type).
  These are seeded from a fixed RNG so the process is reproducible, and are
  deliberately correlated with real fields (auto_make/auto_year/claim ratio) so they
  aren't pure noise:
    - vehicle_price   (derived from auto_make/auto_year band + noise, in INR)
    - driver_rating   (derived from insured_education_level + noise)
    - policy_type     (weighted random: Comprehensive/Third-Party/Zero-Dep)
    - fault           (derived from collision_type / incident_type)
    - accident_area   (derived from incident_type / collision_type)
    - past_claims     (derived from months_as_customer band + Poisson noise)

Run:
    python -m app.ml.build_real_dataset
"""

import os
import numpy as np
import pandas as pd

SEED = 42
RAW_URL = "https://raw.githubusercontent.com/mwitiderrick/insurancedata/master/insurance_claims.csv"


def _derive_vehicle_price(make: str, year: int, rng: np.random.Generator) -> float:
    # Rough relative price tiers by make (INR), then depreciate by age and add noise.
    premium_makes = {"Mercedes", "BMW", "Audi", "Jaguar", "Lexus", "Volkswagen"}
    base = 1_600_000 if make in premium_makes else 850_000
    age = max(0, 2015 - year)
    depreciated = base * (0.93 ** age)
    noisy = depreciated * rng.uniform(0.75, 1.25)
    return float(np.clip(noisy, 150_000, 4_000_000))


def _derive_driver_rating(education: str, rng: np.random.Generator) -> int:
    base = {
        "PhD": 4, "MD": 4, "Masters": 4, "JD": 4,
        "College": 3, "Associate": 3, "High School": 2,
    }.get(str(education), 3)
    noise = rng.choice([-1, 0, 0, 0, 1], p=[0.15, 0.35, 0.2, 0.2, 0.10])
    return int(np.clip(base + noise, 1, 5))


def _derive_fault(incident_type: str, collision_type: str, rng: np.random.Generator) -> str:
    if incident_type == "Vehicle Theft":
        return "Third Party"
    if collision_type in ("Rear Collision",):
        return rng.choice(["Third Party", "Policy Holder"], p=[0.75, 0.25])
    if collision_type in ("Front Collision",):
        return rng.choice(["Policy Holder", "Third Party"], p=[0.60, 0.40])
    return rng.choice(["Policy Holder", "Third Party"], p=[0.55, 0.45])


def _derive_accident_area(incident_type: str, city: str, rng: np.random.Generator) -> str:
    if incident_type == "Vehicle Theft":
        return rng.choice(["Urban", "Rural"], p=[0.8, 0.2])
    if incident_type == "Multi-vehicle Collision":
        return rng.choice(["Urban", "Highway"], p=[0.55, 0.45])
    return rng.choice(["Urban", "Rural", "Highway"], p=[0.5, 0.25, 0.25])


def build_real_dataset(raw_path: str, out_path: str, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    df = pd.read_csv(raw_path)

    out = pd.DataFrame()
    out["age"] = df["age"]
    out["claim_amount"] = df["total_claim_amount"].astype(float)

    # incident_date year minus auto_year -> vehicle_age, grounded in real fields
    incident_year = pd.to_datetime(df["incident_date"], errors="coerce").dt.year.fillna(2015).astype(int)
    out["vehicle_age"] = (incident_year - df["auto_year"]).clip(lower=0, upper=30)

    out["police_report_filed"] = df["police_report_available"].astype(str).str.upper().eq("YES")
    out["witness_present"] = df["witnesses"].fillna(0).astype(int) > 0
    out["incident_severity"] = df["incident_severity"].fillna("Minor Damage")

    out["is_fraud"] = df["fraud_reported"].astype(str).str.upper().eq("Y").astype(int)

    out["vehicle_price"] = [
        _derive_vehicle_price(m, y, rng) for m, y in zip(df["auto_make"], df["auto_year"])
    ]
    out["driver_rating"] = [
        _derive_driver_rating(e, rng) for e in df["insured_education_level"]
    ]
    out["policy_type"] = rng.choice(
        ["Comprehensive", "Third-Party", "Zero-Dep"], size=len(df), p=[0.6, 0.25, 0.15]
    )
    out["fault"] = [
        _derive_fault(it, ct, rng) for it, ct in zip(df["incident_type"], df["collision_type"])
    ]
    out["accident_area"] = [
        _derive_accident_area(it, city, rng) for it, city in zip(df["incident_type"], df["incident_city"])
    ]
    months = df["months_as_customer"].fillna(12).astype(int)
    out["past_claims"] = rng.poisson(lam=np.clip(months / 60.0, 0.1, 3.0)).clip(0, 10)

    out = out.dropna(subset=["age", "claim_amount", "vehicle_age"]).reset_index(drop=True)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    out.to_csv(out_path, index=False)
    print(f"Wrote {len(out)} real (labelled) rows to {out_path}")
    print(f"Fraud rate: {out['is_fraud'].mean():.2%}")
    return out


if __name__ == "__main__":
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    raw_path = os.path.join(data_dir, "insurance_claims_raw_kaggle.csv")
    out_path = os.path.join(data_dir, "insurance_claims_real.csv")

    if not os.path.exists(raw_path):
        raise FileNotFoundError(
            f"Raw dataset not found at {raw_path}.\n"
            f"Download it first, e.g.:\n"
            f"  curl -sL {RAW_URL} -o {raw_path}\n"
            f"(This is the public, real, 1000-row 'Auto Insurance Claims Fraud Detection' "
            f"dataset — the same source the original 19-row excerpt in this repo came from.)"
        )

    build_real_dataset(raw_path, out_path)
