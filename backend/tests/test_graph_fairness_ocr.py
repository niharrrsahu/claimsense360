"""
Tests for Graph Fraud Detection, Algorithmic Fairness Audit, and OCR Extractor
"""

import pytest
from app.services.graph_fraud import detect_fraud_rings
from app.services.fairness_monitor import audit_algorithmic_fairness
from app.services.ocr_service import extract_text_from_claim_document
from app.services.claims_service import seed_initial_claims_if_empty

def test_detect_fraud_rings(db_session):
    seed_initial_claims_if_empty(db_session)
    result = detect_fraud_rings(db_session)
    assert "nodes" in result
    assert "edges" in result
    assert "fraud_rings_count" in result
    assert len(result["nodes"]) > 0

def test_audit_algorithmic_fairness(db_session):
    seed_initial_claims_if_empty(db_session)
    fairness = audit_algorithmic_fairness(db_session)
    assert "disparate_impact_ratio" in fairness
    assert "eighty_percent_rule_pass" in fairness
    assert fairness["total_claims_audited"] > 0

def test_ocr_text_extraction():
    res = extract_text_from_claim_document("invoice.txt", b"Estimate Amount: $5200.00 Police Report #POL-9921")
    assert res["status"] == "OCR Extraction Complete"
    assert res["parsed_fields"]["estimated_amount"] == 5200.0
    assert res["parsed_fields"]["police_report_ref"] == "POL-9921"
