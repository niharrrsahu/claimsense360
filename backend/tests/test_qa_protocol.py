"""
PyTest Test Suite for ClaimSense 360 Quality Assurance Protocol
Enforces 90%+ system accuracy, data integrity, and deterministic scoring.
"""

import pytest
from app.testing.qa_protocol import (
    validate_tabular_fraud_module,
    validate_narrative_deception_module,
    validate_cv_damage_module,
    validate_document_upload_and_integrity_module,
    validate_copilot_module,
    validate_multimodal_fusion_module,
    execute_full_qa_protocol,
)


def test_qa_tabular_fraud_module():
    """Validates XGBoost fraud classifier performance and SHAP determinism."""
    res = validate_tabular_fraud_module()
    assert res["passed"] is True
    assert res["metrics"]["accuracy"] >= 0.78
    assert res["metrics"]["roc_auc"] >= 0.75
    assert res["metrics"]["recall_sensitivity"] >= 0.70
    assert res["integrity"]["deterministic_reproducibility"] is True
    assert res["integrity"]["shap_explanation_validity"] is True


def test_qa_narrative_deception_module():
    """Validates NLP deception classifier 90%+ accuracy and phrase attribution."""
    res = validate_narrative_deception_module()
    assert res["passed"] is True
    assert res["metrics"]["accuracy"] >= 0.90
    assert res["metrics"]["roc_auc"] >= 0.90
    assert res["linguistic_attribution"]["phrase_attribution_verified"] is True


def test_qa_cv_damage_module():
    """Validates Computer Vision damage scoring and EXIF anti-spoofing telemetry."""
    res = validate_cv_damage_module()
    assert res["passed"] is True
    assert res["telemetry_checks"]["smartphone_camera_exif_verified"] is True
    assert res["telemetry_checks"]["web_stock_asset_anti_spoofing_flagged"] is True
    assert res["telemetry_checks"]["spatial_edge_gradient_sensitivity"] is True
    assert res["telemetry_checks"]["deterministic_scoring_verified"] is True


def test_qa_document_upload_and_integrity_module():
    """Validates document upload handling, corrupt byte resilience, and schema safety."""
    res = validate_document_upload_and_integrity_module()
    assert res["passed"] is True
    assert res["checks"]["pydantic_schema_validation"] is True
    assert res["checks"]["corrupt_byte_stream_resilience"] is True
    assert res["checks"]["disk_storage_subsystem_health"] is True


def test_qa_copilot_module():
    """Validates AI Copilot precision, domain specificity, and actionable advice."""
    res = validate_copilot_module()
    assert res["passed"] is True
    assert res["evaluations"]["high_risk_audit_actionable"] is True
    assert res["evaluations"]["financial_exposure_quantified"] is True
    assert res["evaluations"]["specific_claim_deep_dive_verified"] is True
    assert res["evaluations"]["structured_actionable_formatting"] is True


def test_qa_multimodal_fusion_system_accuracy():
    """Validates 90%+ system triage accuracy on comprehensive multi-modal benchmark."""
    res = validate_multimodal_fusion_module()
    assert res["passed"] is True
    assert res["system_accuracy"] >= 0.90
    assert res["high_risk_precision"] >= 0.85
    assert res["high_risk_recall"] >= 0.90
    assert res["meets_enterprise_standard"] is True


def test_qa_full_protocol_orchestrator():
    """Validates that all QA modules pass under master orchestrator execution."""
    full_report = execute_full_qa_protocol()
    assert full_report["summary"]["all_modules_passed"] is True
    assert full_report["summary"]["certification_status"] == "CERTIFIED_ENTERPRISE_GRADE"
    assert full_report["summary"]["overall_system_accuracy"] >= 0.90
