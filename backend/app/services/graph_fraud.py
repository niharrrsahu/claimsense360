"""
Graph Fraud Analytics Service
Analyzes relationships between claims (shared policy types, accident areas, driver ratings, and severity)
to detect potential fraud rings using network graph analysis.
"""

from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.claim import Claim

def detect_fraud_rings(db: Session) -> Dict[str, Any]:
    """
    Builds a network graph of claims and identifies suspicious clusters (fraud rings).
    Returns nodes and edges formatted for interactive UI graph rendering.
    """
    claims = db.query(Claim).all()
    if not claims:
        return {"nodes": [], "edges": [], "fraud_rings_count": 0, "high_risk_clusters": []}

    nodes = []
    edges = []
    edge_set = set()

    for c in claims:
        nodes.append({
            "id": f"claim_{c.id}",
            "label": f"Claim #{c.id}",
            "claim_amount": c.claim_amount,
            "risk_score": round(float(c.risk_score), 3),
            "risk_level": c.risk_level,
            "policy_type": c.policy_type,
            "accident_area": c.accident_area,
            "incident_severity": c.incident_severity,
            "type": "claim"
        })

    # Link claims sharing high-risk attributes (e.g. same accident area + policy type + high risk)
    for i in range(len(claims)):
        for j in range(i + 1, len(claims)):
            c1, c2 = claims[i], claims[j]
            shared_attrs = []
            if c1.accident_area == c2.accident_area:
                shared_attrs.append("accident_area")
            if c1.policy_type == c2.policy_type:
                shared_attrs.append("policy_type")
            if c1.incident_severity == c2.incident_severity and c1.incident_severity in ["Major Damage", "Total Loss"]:
                shared_attrs.append("high_severity")

            if len(shared_attrs) >= 2 and (c1.risk_level == "HIGH" or c2.risk_level == "HIGH"):
                edge_id = f"claim_{c1.id}-claim_{c2.id}"
                if edge_id not in edge_set:
                    edge_set.add(edge_id)
                    edges.append({
                        "source": f"claim_{c1.id}",
                        "target": f"claim_{c2.id}",
                        "reason": ", ".join(shared_attrs),
                        "weight": len(shared_attrs)
                    })

    # Group connected high risk nodes into clusters
    high_risk_ids = {f"claim_{c.id}" for c in claims if c.risk_level == "HIGH"}
    fraud_rings = []
    visited = set()

    for node_id in high_risk_ids:
        if node_id not in visited:
            cluster = set()
            queue = [node_id]
            visited.add(node_id)
            while queue:
                curr = queue.pop(0)
                cluster.add(curr)
                for edge in edges:
                    nbr = None
                    if edge["source"] == curr:
                        nbr = edge["target"]
                    elif edge["target"] == curr:
                        nbr = edge["source"]
                    if nbr and nbr not in visited:
                        visited.add(nbr)
                        queue.append(nbr)
            if len(cluster) >= 2:
                fraud_rings.append(list(cluster))

    return {
        "nodes": nodes,
        "edges": edges,
        "fraud_rings_count": len(fraud_rings),
        "high_risk_clusters": fraud_rings,
        "summary": f"Detected {len(fraud_rings)} suspicious fraud ring cluster(s) with shared attributes."
    }
