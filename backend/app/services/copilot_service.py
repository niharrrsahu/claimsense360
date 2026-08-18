import os
import re
from sqlalchemy.orm import Session
from app.models.claim import Claim

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    anthropic = None
    HAS_ANTHROPIC = False


def generate_heuristic_copilot_response(db: Session, question: str, claim_id: int | None = None) -> str:
    """
    Intelligent NLP Heuristic Engine for AI Copilot.
    Parses natural language user queries against real-time database claims,
    extracting specific claim IDs, customer names, financial risks, and statistics.
    """
    q_lower = question.lower().strip()
    
    # 1. Direct Claim ID Audit Request
    extracted_id = claim_id
    if not extracted_id:
        id_match = re.search(r'(?:claim\s*#?|#)(\d+)', q_lower)
        if id_match:
            extracted_id = int(id_match.group(1))
            
    if extracted_id:
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
        else:
            return f"⚠️ Claim #{extracted_id} was not found in the database directory."

    # Fetch all claims ordered by recency
    recent_claims = db.query(Claim).order_by(Claim.created_at.desc()).all()
    total_count = len(recent_claims)
    high_risk_claims = [c for c in recent_claims if c.overall_risk_score >= 50.0 or "high" in c.risk_band.lower()]
    medium_risk_claims = [c for c in recent_claims if 30.0 <= c.overall_risk_score < 50.0 or "medium" in c.risk_band.lower()]
    low_risk_claims = [c for c in recent_claims if c.overall_risk_score < 30.0 or "low" in c.risk_band.lower()]

    # 2. Customer Name Search in Query
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

    # 3. High Risk / Fraud Audit Inquiries
    if any(kw in q_lower for kw in ["high", "fraud", "audit", "flag", "suspicious", "danger", "worst", "threat"]):
        if high_risk_claims:
            lines = [f"🚨 **High-Risk Claims Audit Summary ({len(high_risk_claims)} Flagged)**:\n"]
            for c in high_risk_claims[:5]:
                lines.append(
                    f"• **Claim #{c.id}** ({c.customer_name}) — Score: **{c.overall_risk_score}/100** | ₹{c.claim_amount:,} | {c.vehicle_make_model} → *{c.recommended_action}*"
                )
            lines.append("\nView full priority queue at `/fraud` page.")
            return "\n".join(lines)
        else:
            return "✅ **No High-Risk Fraud Claims Detected**. All active claims are evaluated below the 50.0 risk threshold."

    # 4. Highest Financial Value Inquiries
    if any(kw in q_lower for kw in ["highest", "max", "top", "financial", "expensive", "money", "cost", "value"]):
        if recent_claims:
            top_amount = max(recent_claims, key=lambda x: x.claim_amount)
            top_risk = max(recent_claims, key=lambda x: x.overall_risk_score)
            return (
                f"💰 **Financial Portfolio Insights**:\n\n"
                f"• **Largest Financial Claim**: Claim #{top_amount.id} ({top_amount.customer_name}) for **₹{top_amount.claim_amount:,}** ({top_amount.vehicle_make_model})\n"
                f"• **Highest Fraud Risk Claim**: Claim #{top_risk.id} ({top_risk.customer_name}) with Risk Score **{top_risk.overall_risk_score}/100**\n\n"
                f"• **Total Portfolio Claims Value**: ₹{sum(c.claim_amount for c in recent_claims):,}"
            )

    # 5. Greetings / Help / Capabilities
    if any(kw in q_lower for kw in ["hello", "hi", "hey", "help", "greet", "start", "who", "what"]):
        return (
            f"👋 **Welcome! I am your ClaimSense 360 AI Copilot.**\n\n"
            f"I monitor **{total_count} claims** currently stored in your system:\n"
            f"• 🔴 **High Risk**: {len(high_risk_claims)} claims (Overall Score ≥ 50)\n"
            f"• 🟡 **Medium Risk**: {len(medium_risk_claims)} claims (Score 30-49)\n"
            f"• 🟢 **Low Risk**: {len(low_risk_claims)} claims (Score < 30)\n\n"
            f"Try asking:\n"
            f"• *'Show high risk claims'*\n"
            f"• *'Which claim has the highest financial amount?'*\n"
            f"• *'Explain claim #11'*"
        )

    # 6. General Stats & Portfolio Overview
    if any(kw in q_lower for kw in ["stat", "summary", "total", "count", "avg", "average", "overview"]):
        avg_score = round(sum(c.overall_risk_score for c in recent_claims) / total_count, 1) if total_count > 0 else 0
        avg_amt = int(round(sum(c.claim_amount for c in recent_claims) / total_count)) if total_count > 0 else 0
        return (
            f"📊 **System Portfolio Statistics**:\n\n"
            f"• **Total Claims**: {total_count}\n"
            f"• **Average Risk Score**: {avg_score}/100\n"
            f"• **Average Claim Amount**: ₹{avg_amt:,}\n"
            f"• **High Risk Flags**: {len(high_risk_claims)}\n"
            f"• **Medium Risk**: {len(medium_risk_claims)} | **Low Risk**: {len(low_risk_claims)}"
        )

    # 7. Generic Intelligent Fallback
    if recent_claims:
        latest = recent_claims[0]
        return (
            f"🔍 **AI Intelligence Audit for Query: '{question}'**\n\n"
            f"Processed search across **{total_count} claims** in database:\n"
            f"• **Latest Submitted Claim**: Claim #{latest.id} ({latest.customer_name}) — ₹{latest.claim_amount:,} for {latest.vehicle_make_model} (Risk Score: {latest.overall_risk_score}/100)\n"
            f"• **Portfolio Status**: {len(high_risk_claims)} High Risk, {len(medium_risk_claims)} Medium Risk, {len(low_risk_claims)} Low Risk.\n\n"
            f"💡 *Tip*: Type a specific claim ID (e.g. `claim #11`), customer name, or keyword like `high risk` for targeted analysis!"
        )
    return "No claims available in database yet. Submit a new claim via `/claims/new` to test live AI risk scoring!"


def ask_copilot(db: Session, question: str, claim_id: int | None = None) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not HAS_ANTHROPIC or not api_key or not api_key.strip():
        # Seamlessly fallback to built-in AI claims engine
        return generate_heuristic_copilot_response(db=db, question=question, claim_id=claim_id)

        
    # Build context for Anthropic API
    if claim_id:
        c = db.query(Claim).filter(Claim.id == claim_id).first()
        if c:
            context = (
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
        else:
            context = f"Claim #{claim_id} was requested but not found in database."
    else:
        recent_claims = db.query(Claim).order_by(Claim.created_at.desc()).limit(15).all()
        if not recent_claims:
            context = "No claims recorded in database yet."
        else:
            context_lines = [f"SUMMARY OF RECENT {len(recent_claims)} CLAIMS:"]
            for c in recent_claims:
                context_lines.append(
                    f"- Claim #{c.id} ({c.customer_name}): Vehicle {c.vehicle_make_model}, Amount ₹{c.claim_amount:,}, "
                    f"Risk Score {c.overall_risk_score}/100 ({c.risk_band}), Action: '{c.recommended_action}'"
                )
            context = "\n".join(context_lines)
            
    system_prompt = (
        "You are ClaimSense 360 AI Copilot — an expert insurance claims intelligence assistant. "
        "Answer the user's questions based STRICTLY on the provided claim context. "
        "If the context does not contain sufficient details to answer the question, state that clearly."
    )
    
    try:
        client = anthropic.Anthropic(api_key=api_key)
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
        return "".join([block.text for block in response.content if hasattr(block, "text")])
    except Exception:
        # Fallback gracefully if API call encounters network error
        return generate_heuristic_copilot_response(db=db, question=question, claim_id=claim_id)

