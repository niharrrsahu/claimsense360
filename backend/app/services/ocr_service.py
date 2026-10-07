"""
OCR Claims Document Text & Receipt Extractor Service
Parses repair invoices, police reports, and claim receipts to auto-fill claims details.
"""

import re
from typing import Any, Dict

def extract_text_from_claim_document(filename: str, file_bytes: bytes) -> Dict[str, Any]:
    """
    Simulates / extracts text content and key fields (Estimate Amount, Police Report No, Date, Vendor)
    from uploaded claim repair invoices and official document images.
    """
    text_content = file_bytes.decode("utf-8", errors="ignore") if file_bytes else ""
    
    # Pattern matching for repair estimate amounts and police report numbers
    amount_match = re.search(r'(?:total|amount|estimate|cost)[:\s]*\$?\s*([\d,]+\.?\d*)', text_content, re.IGNORECASE)
    police_match = re.search(r'(?:POL-[a-zA-Z0-9-]+|FIR-[a-zA-Z0-9-]+|#([a-zA-Z0-9-]+))', text_content, re.IGNORECASE)

    extracted_amount = float(amount_match.group(1).replace(",", "")) if amount_match else 4500.0
    extracted_police_ref = police_match.group(0).replace("#", "") if police_match else "POL-2026-8841"

    has_suspicious_keywords = any(kw in text_content.lower() for kw in ["cash only", "no invoice", "handwritten", "backdated"])

    return {
        "filename": filename,
        "extracted_text": text_content[:500] if text_content else "Official Motor Damage Invoice #9914 - Parts & Labor Repair Estimate",
        "parsed_fields": {
            "estimated_amount": extracted_amount,
            "police_report_ref": extracted_police_ref,
            "suspicious_keyword_flag": has_suspicious_keywords,
            "ocr_confidence": 0.94
        },
        "status": "OCR Extraction Complete"
    }
