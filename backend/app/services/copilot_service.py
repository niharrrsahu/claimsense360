import logging
import os
import re

from sqlalchemy.orm import Session

from app.models.claim import Claim

logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    genai = None
    HAS_GEMINI = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    anthropic = None
    HAS_ANTHROPIC = False


def _handle_claim_id_audit(db: Session, extracted_id: int) -> str | None:
    c = db.query(Claim).filter(Claim.id == extracted_id).first()
    if c:
        return (
            f"📋 **Claim #{c.id} Deep-Dive Audit ({c.customer_name})**:\n\n"
            f"• **Risk Assessment**: Score **{c.overall_risk_score}/100** ({c.risk_band.upper()})\n"
            f"• **Claim Amount**: ₹{c.claim_amount:,} (Vehicle Value: ₹{c.vehicle_price:,})\n"
            f"• **Vehicle Model**: {c.vehicle_make_model} ({c.vehicle_age} yrs old, Driver Rating: {c.driver_rating}/5)\n"
            f"• **Incident Location**: {c.accident_area} area • Fault: {c.fault}\n"
            f"• **Police Report**: {'Filed ✓' if c.police_report_filed else 'Not Filed ⚠️'} • Witness: {'Present ✓' if c.witness_present else 'None ⚠️'}\n"
            f"• **AI Recommendation**: **{c.recommended_action}**\n"
            f"• **Damage Photo**: {c.damage_severity or 'Not uploaded'}\n\n"
            f"📝 *Description*: \"{c.incident_description or 'N/A'}\""
        )
    return f"⚠️ Claim #{extracted_id} was not found in the database directory."


def _handle_customer_search(recent_claims: list[Claim], q_lower: str) -> str | None:
    for c in recent_claims:
        if c.customer_name and len(c.customer_name.split()) > 0:
            first_name = c.customer_name.split()[0].lower()
            if len(first_name) >= 3 and first_name in q_lower:
                return (
                    f"👤 **Customer Match Identified: {c.customer_name}** (Claim #{c.id}):\n\n"
                    f"• **Overall Risk Score**: **{c.overall_risk_score}/100** ({c.risk_band.upper()})\n"
                    f"• **Claim Amount**: ₹{c.claim_amount:,} for {c.vehicle_make_model}\n"
                    f"• **Incident Area**: {c.accident_area} • Past Claims: {c.past_claims}\n"
                    f"• **Recommended Action**: {c.recommended_action}\n\n"
                    f"Visit `/claims/{c.id}` for complete SHAP & Damage analysis."
                )
    return None


def _handle_high_risk_inquiry(high_risk_claims: list[Claim], q_lower: str) -> str | None:
    if any(kw in q_lower for kw in ["high", "fraud", "audit", "flag", "suspicious", "danger", "worst", "threat"]):
        if high_risk_claims:
            lines = [f"🚨 **High-Risk Claims Audit Summary ({len(high_risk_claims)} Flagged)**:\n"]
            for c in high_risk_claims[:5]:
                lines.append(
                    f"• **Claim #{c.id}** ({c.customer_name}) — Score: **{c.overall_risk_score}/100** | ₹{c.claim_amount:,} | {c.vehicle_make_model} → *{c.recommended_action}*"
                )
            lines.append("\nView full priority queue at `/fraud` page.")
            return "\n".join(lines)
        return "✅ **No High-Risk Fraud Claims Detected**. All active claims are evaluated below the 50.0 risk threshold."
    return None


def _handle_financial_inquiry(recent_claims: list[Claim], q_lower: str) -> str | None:
    if any(kw in q_lower for kw in ["highest", "max", "top", "financial", "expensive", "money", "cost", "value"]) and recent_claims:
        top_amount = max(recent_claims, key=lambda x: x.claim_amount)
        top_risk = max(recent_claims, key=lambda x: x.overall_risk_score)
        return (
            f"💰 **Financial Portfolio Insights**:\n\n"
            f"• **Largest Financial Claim**: Claim #{top_amount.id} ({top_amount.customer_name}) for **₹{top_amount.claim_amount:,}** ({top_amount.vehicle_make_model})\n"
            f"• **Highest Fraud Risk Claim**: Claim #{top_risk.id} ({top_risk.customer_name}) with Risk Score **{top_risk.overall_risk_score}/100**\n\n"
            f"• **Total Portfolio Claims Value**: ₹{sum(c.claim_amount for c in recent_claims):,}"
        )
    return None


def _handle_greeting_inquiry(total_count: int, high_len: int, med_len: int, low_len: int, q_lower: str) -> str | None:
    if any(kw in q_lower for kw in ["hello", "hi", "hey", "help", "greet", "start", "who", "what"]):
        return (
            f"👋 **Welcome! I am your ClaimSense 360 AI Copilot.**\n\n"
            f"I monitor **{total_count} claims** currently stored in your system:\n"
            f"• 🔴 **High Risk**: {high_len} claims (Overall Score ≥ 50)\n"
            f"• 🟡 **Medium Risk**: {med_len} claims (Score 30-49)\n"
            f"• 🟢 **Low Risk**: {low_len} claims (Score < 30)\n\n"
            f"Try asking:\n"
            f"• *'Show high risk claims'*\n"
            f"• *'Which claim has the highest financial amount?'*\n"
            f"• *'Explain claim #11'*"
        )
    return None


def _handle_stats_inquiry(recent_claims: list[Claim], total_count: int, high_len: int, med_len: int, low_len: int, q_lower: str) -> str | None:
    if any(kw in q_lower for kw in ["stat", "summary", "total", "count", "avg", "average", "overview"]):
        avg_score = round(sum(c.overall_risk_score for c in recent_claims) / total_count, 1) if total_count > 0 else 0
        avg_amt = round(sum(c.claim_amount for c in recent_claims) / total_count) if total_count > 0 else 0
        return (
            f"📊 **System Portfolio Statistics**:\n\n"
            f"• **Total Claims**: {total_count}\n"
            f"• **Average Risk Score**: {avg_score}/100\n"
            f"• **Average Claim Amount**: ₹{avg_amt:,}\n"
            f"• **High Risk Flags**: {high_len}\n"
            f"• **Medium Risk**: {med_len} | **Low Risk**: {low_len}"
        )
    return None


def generate_heuristic_copilot_response(db: Session, question: str, claim_id: int | None = None) -> str:
    """
    Rule-based fallback response generator, used when GEMINI_API_KEY is not configured.
    """
    q_lower = question.lower().strip()

    extracted_id = claim_id
    if not extracted_id:
        id_match = re.search(r'(?:claim\s*#?|#)(\d+)', q_lower)
        if id_match:
            extracted_id = int(id_match.group(1))

    if extracted_id:
        res = _handle_claim_id_audit(db, extracted_id)
        if res:
            return res

    recent_claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    total_count = len(recent_claims)
    high_risk = [c for c in recent_claims if c.overall_risk_score >= 50.0 or "high" in c.risk_band.lower()]
    medium_risk = [c for c in recent_claims if 30.0 <= c.overall_risk_score < 50.0 or "medium" in c.risk_band.lower()]
    low_risk = [c for c in recent_claims if c.overall_risk_score < 30.0 or "low" in c.risk_band.lower()]

    cust_res = _handle_customer_search(recent_claims, q_lower)
    if cust_res:
        return cust_res

    high_res = _handle_high_risk_inquiry(high_risk, q_lower)
    if high_res:
        return high_res

    fin_res = _handle_financial_inquiry(recent_claims, q_lower)
    if fin_res:
        return fin_res

    greet_res = _handle_greeting_inquiry(total_count, len(high_risk), len(medium_risk), len(low_risk), q_lower)
    if greet_res:
        return greet_res

    stats_res = _handle_stats_inquiry(recent_claims, total_count, len(high_risk), len(medium_risk), len(low_risk), q_lower)
    if stats_res:
        return stats_res

    if recent_claims:
        latest = recent_claims[0]
        return (
            f"🔍 **AI Intelligence Audit for Query: '{question}'**\n\n"
            f"Processed search across **{total_count} claims** in database:\n"
            f"• **Latest Submitted Claim**: Claim #{latest.id} ({latest.customer_name}) — ₹{latest.claim_amount:,} for {latest.vehicle_make_model} (Risk Score: {latest.overall_risk_score}/100)\n"
            f"• **Portfolio Status**: {len(high_risk)} High Risk, {len(medium_risk)} Medium Risk, {len(low_risk)} Low Risk.\n\n"
            f"💡 *Tip*: Type a specific claim ID (e.g. `claim #11`), customer name, or keyword like `high risk` for targeted analysis!"
        )
    return "No claims available in database yet. Submit a new claim via `/claims/new` to test live AI risk scoring!"


def _build_claim_context(db: Session, claim_id: int | None = None) -> str:
    if claim_id:
        c = db.query(Claim).filter(Claim.id == claim_id).first()
        if c:
            return (
                f"CLAIM DETAILS (Claim #{c.id}):\n"
                f"- Customer Name: {c.customer_name}\n"
                f"- Vehicle: {c.vehicle_make_model} (Age: {c.vehicle_age} yrs, Price: ₹{c.vehicle_price:,})\n"
                f"- Claim Amount: ₹{c.claim_amount:,}\n"
                f"- Driver Rating: {c.driver_rating}/5, Past Claims: {c.past_claims}\n"
                f"- Policy Type: {c.policy_type}, Fault: {c.fault}, Accident Area: {c.accident_area}\n"
                f"- Police Report: {'Yes' if c.police_report_filed else 'No'}, Witness: {'Yes' if c.witness_present else 'No'}\n"
                f"- Incident Description: {c.incident_description or 'None'}\n"
                f"- Overall Risk Score: {c.overall_risk_score}/100 ({c.risk_band})\n"
                f"- Recommended Action: {c.recommended_action}\n"
                f"- Damage Severity: {c.damage_severity or 'Not uploaded'}\n"
            )
        return f"Claim #{claim_id} was requested but not found in database."

    recent_claims = db.query(Claim).order_by(Claim.created_at.desc()).limit(20).all()
    if not recent_claims:
        return "No claims recorded in database yet."

    lines = [f"SUMMARY OF RECENT {len(recent_claims)} CLAIMS IN DATABASE:"]
    for c in recent_claims:
        lines.append(
            f"- Claim #{c.id} ({c.customer_name}): Vehicle {c.vehicle_make_model}, Amount ₹{c.claim_amount:,}, "
            f"Risk Score {c.overall_risk_score}/100 ({c.risk_band}), Action: '{c.recommended_action}'"
        )
    return "\n".join(lines)


def _ask_gemini(context: str, question: str, api_key: str) -> str | None:
    if not api_key or not api_key.strip():
        return None

    clean_key = api_key.strip()
    system_prompt = (
        "You are ClaimSense 360 AI Copilot — an expert insurance claims intelligence & fraud forensics assistant "
        "built for Nihar Sahu's platform. Respond naturally, intelligently, and conversationally to ANY user prompt "
        "(greetings, general chat, claims audit, financial risk, fraud analysis, technical concepts). "
        "Use markdown formatting with bullet points, bold text, and professional emojis. "
        "Base your domain answers on the provided database claims context when relevant."
    )

    # Method 1: Google Generative AI Python SDK
    if HAS_GEMINI and genai:
        try:
            genai.configure(api_key=clean_key)
            model_candidates = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest", "gemini-1.5-pro", "gemini-pro"]
            for model_name in model_candidates:
                try:
                    g_model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=system_prompt
                    )
                    prompt_content = f"DATABASE CLAIM CONTEXT:\n{context}\n\nUSER QUESTION / PROMPT:\n{question}"
                    response = g_model.generate_content(prompt_content)
                    if response and hasattr(response, "text") and response.text:
                        return response.text.strip()
                except Exception as exc:
                    logger.debug(f"Gemini model {model_name} invocation failed: {exc}")
                    continue
        except Exception as exc:
            logger.warning(f"Google Gemini API SDK initialization error: {exc}")

    # Method 2: Direct REST API Fallback
    try:
        import json
        import urllib.request

        rest_models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-1.5-flash"]
        for m_name in rest_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m_name}:generateContent"
            headers = {
                "Content-Type": "application/json",
                "X-goog-api-key": clean_key
            }
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"System Instruction: {system_prompt}\n\nDatabase Context:\n{context}\n\nUser Question: {question}"}
                        ]
                    }
                ]
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
    except Exception as exc:
        logger.warning(f"Gemini REST API fallback error: {exc}")

    return None


def _ask_anthropic(context: str, question: str, api_key: str) -> str | None:
    if not HAS_ANTHROPIC or not api_key or not api_key.strip():
        return None

    system_prompt = (
        "You are ClaimSense 360 AI Copilot — an expert insurance claims intelligence assistant. "
        "Answer the user's questions based STRICTLY on the provided claim context. "
        "If the context does not contain sufficient details to answer the question, state that clearly."
    )
    try:
        client = anthropic.Anthropic(api_key=clean_key)
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion: {question}"
                }
            ]
        )
        text = "".join([block.text for block in response.content if hasattr(block, "text")])
        return text.strip() if text else None
    except Exception as exc:
        logger.warning(f"Anthropic API call failed: {exc}")
        return None


def ask_copilot(db: Session, question: str, claim_id: int | None = None) -> str:
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    context = _build_claim_context(db=db, claim_id=claim_id)

    # 1. Primary AI Provider: Google Gemini API (Free Tier)
    if gemini_key and gemini_key.strip():
        gemini_response = _ask_gemini(context=context, question=question, api_key=gemini_key)
        if gemini_response:
            return gemini_response

    # 2. Secondary AI Provider: Anthropic Claude API
    if anthropic_key and anthropic_key.strip():
        claude_response = _ask_anthropic(context=context, question=question, api_key=anthropic_key)
        if claude_response:
            return claude_response

    # 3. Transparent Fallback: Built-in Heuristic AI Engine
    fallback_tag = "\n\n_(Powered by rule-based fallback — configure GEMINI_API_KEY for full AI reasoning)_"
    raw_resp = generate_heuristic_copilot_response(db=db, question=question, claim_id=claim_id)
    return raw_resp + fallback_tag
