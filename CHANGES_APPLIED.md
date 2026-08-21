# What's in this zip

This is your `claimsense360` repo with the CRITICAL and HIGH-priority fixes applied and
**actually tested end-to-end** (not just written and hoped for). The full technical
reasoning for every fix is in `ClaimSense360_Full_Audit_And_Fix_Plan.md` — read that
alongside this file.

**Not included in this zip (unchanged from your repo, and large):**
`backend/app/data/yolo_dataset/` (1.4GB, 31,000+ files) — copy it back in from your
existing local clone before running anything that needs it. `node_modules`, `.next`,
`backend/claimsense.db`, and `backend/app/uploads/` were removed since they're
build/runtime artifacts, not source.

---

## Backend changes (`backend/`)

### Security (all verified with real HTTP requests against a running server)
- **`app/core/auth.py`** — Removed the auth bypass. Previously *any* request with no
  token, or a fake/invalid token, silently became an authenticated admin. Now: no
  token → `401`, invalid/expired token → `401`, unknown user → `401`. Verified:
  `curl` with no `Authorization` header and with a garbage token both now return
  `401` (previously both would have returned `200` with real data).
  `SECRET_KEY` now comes from the required `JWT_SECRET_KEY` env var (the app refuses
  to start if it's missing) instead of being hardcoded in source.
- **`app/services/auth_service.py`** — Removed the hardcoded `admin@claimsense.ai` /
  `password123` backdoor that bypassed the password check entirely.
- **`app/main.py`** — CORS now reads allowed origin(s) from `FRONTEND_ORIGIN` env var
  instead of `allow_origins=["*"]` (which is unsafe combined with
  `allow_credentials=True`). Also added an auto-migration line for the new
  `incident_severity` column (see below).

### Real bug fix
- **`app/services/claims_service.py`** — Added missing `import os` and `import uuid`.
  Previously every image upload silently failed to save to disk (`NameError`, caught
  by a bare `except`) and fell back to storing full base64 in the DB — the opposite
  of what the code's own comment said it was trying to do. **Verified**: submitted a
  claim with an image and confirmed a real file now appears in `app/uploads/`.

### ML — fraud model, retrained and verified
- **`app/data/insurance_claims_real.csv`** — Replaced the 19-row stub with a proper
  1000-row dataset built from the real, public "Auto Insurance Claims Fraud
  Detection" dataset via a new script:
- **`app/ml/build_real_dataset.py`** (new file) — Documents exactly which fields are
  taken directly from the real data (age, claim amount, police report, witnesses,
  incident severity, the real fraud label) vs. which are synthesized because this
  app's schema uses concepts (₹ vehicle price, Indian policy types) that don't exist
  in the source dataset. Also documents, explicitly, why `insured_hobbies` (the
  single strongest raw predictor at 75-83% fraud correlation for "chess"/"cross-fit")
  is deliberately NOT used — it's a known artifact of this specific teaching
  dataset, not a legitimate real-world fraud signal.
- **New field `incident_severity`** added throughout: `app/schemas/claim.py`,
  `app/models/claim.py` (+ auto-migration line in `main.py`), `app/ml/predict.py`
  (feature name mapping + SHAP aggregation), `app/ml/train_fraud_model.py`
  (categorical feature list), `app/ml/generate_data.py` (synthetic fallback path),
  `app/services/claims_service.py` (all 6 hardcoded seed claims), `app/api/claims.py`
  (3 places that rebuild the feature dict for SHAP recomputation), and
  `app/ml/seed_kaggle_dataset.py`.
- **Verified retraining result**: ROC-AUC went from **0.51** (with the old 19-row
  data — statistically no better than random) to **0.75** (1000 real rows +
  `incident_severity` feature). Precision 55.6%, Recall 40.8%, 5-fold CV accuracy
  75.1% ± 2.0%. Model artifacts in `app/ml_models/` were regenerated with this run.

### ML — narrative NLP model
- **`app/ml/generate_narrative_data.py`** — Expanded from 5 to 12 templates per
  class. **Important honest caveat, verified**: this alone pushed train/test accuracy
  straight to 100% / ROC-AUC 1.0 — which is a red flag, not a win. It means even 12
  templates is still trivially separable by sentence structure, not genuine
  deception-language understanding. `ClaimSense360_Full_Audit_And_Fix_Plan.md`
  §3.2 explains what's actually needed (real narrative text, or 50+ varied
  templates, or fine-tuning a small transformer on your GPU).

## Frontend changes (Next.js, all touched files pass `tsc --noEmit` and `next build`
gets past the bundling stage — the only build error left is an unrelated Google
Fonts network fetch that has nothing to do with these changes)

- **`app/api/login/route.ts`** / **`app/api/signup/route.ts`** — Removed the
  "seamless fallback" that silently authenticated *any* email/password with a fake
  token whenever the backend was unreachable. Now returns a real `502`/`401` error
  instead. Cookie `secure` flag is now `true` in production instead of hardcoded
  `false`.
- **`app/api/copilot/route.ts`** — Removed the fake `"AI Copilot processed your
  request successfully."` message that was returned on *any* failure. Now returns a
  real error.
- **`app/api/claims/analyze/route.ts`** — Removed the fabricated fraud
  score/damage/SHAP-factor fallback (hardcoded phrases like `"Front Bumper
  Assembly"`, a hand-written scoring formula) that activated whenever the backend
  was unreachable. Now returns a real `502` and the UI should show a real "analysis
  unavailable" message instead of fake results.
- **`lib/server-data.ts`** — Increased the backend fetch timeout from 2s to 10s
  (2s was aborting almost every request during a Railway cold start, which commonly
  takes 5-15+ seconds).
- **`lib/config.ts`** — Added a startup warning if `NEXT_PUBLIC_API_URL` isn't set
  in production (previously it would silently fall back to `localhost:8000`).
- **`app/claims/new/page.tsx`** — Added the `incident_severity` field (select
  dropdown: Trivial/Minor/Major/Total Loss) to match the new backend schema.

## Repo hygiene
- **`backend/.dockerignore`** — Now excludes `app/data/yolo_dataset/` (1.4GB) and
  the raw Kaggle CSV from the Docker build context — previously only
  `app/ml_models/` was excluded, so every Railway deploy was copying 1.4GB of
  training images into the image.
- **`.gitignore`** — Added the same large-data paths going forward.

## What I deliberately did NOT do
- Did not fine-tune YOLOv8 on the real 15,942-image car-damage dataset — that
  needs your RTX 4060 and a few hours; the dataset and training script
  (`train_custom_yolo_model()` in `app/ml/damage_analysis.py`) are already there
  and ready. See the audit doc §3.3 for exact instructions.
- Did not rewrite git history to purge the 1.4GB dataset from old commits — that's
  a destructive operation (`git filter-repo`/BFG) you should run yourself with a
  fresh clone backup, not something to do silently on your behalf.
- Did not touch Railway/Vercel dashboard settings — you'll need to set
  `JWT_SECRET_KEY`, `FRONTEND_ORIGIN`, `DATABASE_URL`, `ANTHROPIC_API_KEY` on
  Railway, and confirm `NEXT_PUBLIC_API_URL` on Vercel, yourself (see audit §5.2).
