import "server-only";


import { cookies } from "next/headers";


import { API_BASE_URL } from "@/lib/config";

async function fetchWithAuth(endpoint: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cs_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching server data [${endpoint}]:`, error);
    return null;
  }
}


export async function getCurrentUser() {
  return await fetchWithAuth("/auth/me");
}

export async function getClaimsStats() {
  return await fetchWithAuth("/claims/stats/summary");
}

const DEFAULT_DEMO_CLAIMS = [
  {
    id: 10001,
    customer_name: "Policyholder #521585 (Craft Repair)",
    vehicle_make_model: "Saab 92x (2004)",
    age: 48,
    vehicle_price: 850000,
    claim_amount: 71610,
    vehicle_age: 11,
    past_claims: 2,
    driver_rating: 2,
    policy_type: "Comprehensive",
    fault: "Policy Holder",
    accident_area: "Urban",
    police_report_filed: true,
    witness_present: true,
    incident_description: "Single Vehicle Collision with Side Impact at Columbus, 5 AM (Incident Severity: Major Damage).",
    narrative_suspicion_score: 78.0,
    fraud_probability: 0.82,
    fraud_score: 82.0,
    overall_risk_score: 82.0,
    risk_band: "High risk",
    recommended_action: "Flag for SIU Fraud Audit",
    damage_severity: "Major Crush",
    damage_score: 82.5,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 10002,
    customer_name: "Policyholder #552404 (Direct Drive)",
    vehicle_make_model: "Mercedes E350 (2007)",
    age: 42,
    vehicle_price: 1800000,
    claim_amount: 50700,
    vehicle_age: 8,
    past_claims: 0,
    driver_rating: 4,
    policy_type: "Comprehensive",
    fault: "Third Party",
    accident_area: "Urban",
    police_report_filed: true,
    witness_present: false,
    incident_description: "Vehicle theft reported at night. Police report filed immediately.",
    narrative_suspicion_score: 15.0,
    fraud_probability: 0.18,
    fraud_score: 18.0,
    overall_risk_score: 18.0,
    risk_band: "Low risk",
    recommended_action: "Fast-track 3-Second Settlement",
    damage_severity: "Minor Bumper Scratch",
    damage_score: 12.0,
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 10003,
    customer_name: "Policyholder #541930 (Premier Auto)",
    vehicle_make_model: "Dodge Neon (2007)",
    age: 29,
    vehicle_price: 650000,
    claim_amount: 34500,
    vehicle_age: 7,
    past_claims: 1,
    driver_rating: 3,
    policy_type: "Zero-Dep",
    fault: "Policy Holder",
    accident_area: "Rural",
    police_report_filed: false,
    witness_present: true,
    incident_description: "Rear collision at intersection. Minor bumper damage.",
    narrative_suspicion_score: 42.0,
    fraud_probability: 0.45,
    fraud_score: 45.0,
    overall_risk_score: 45.0,
    risk_band: "Medium risk",
    recommended_action: "Require Secondary Photo Verification",
    damage_severity: "Moderate Bumper Damage",
    damage_score: 48.0,
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 10004,
    customer_name: "Policyholder #589211 (City Shield)",
    vehicle_make_model: "Hyundai Creta 1.5 SX",
    age: 35,
    vehicle_price: 1400000,
    claim_amount: 95000,
    vehicle_age: 3,
    past_claims: 3,
    driver_rating: 1,
    policy_type: "Comprehensive",
    fault: "Policy Holder",
    accident_area: "Highway",
    police_report_filed: false,
    witness_present: false,
    incident_description: "Front left bumper crushing and hood crumple on highway at 2 AM.",
    narrative_suspicion_score: 88.0,
    fraud_probability: 0.91,
    fraud_score: 91.0,
    overall_risk_score: 91.0,
    risk_band: "High risk",
    recommended_action: "Flag for SIU Fraud Audit",
    damage_severity: "Severe Frontal Impact",
    damage_score: 89.0,
    created_at: new Date(Date.now() - 345600000).toISOString()
  }
];

export async function getClaimsHistory(limit: number = 50, query?: string | null) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (query) {
    params.set("q", query);
  }
  const result = await fetchWithAuth(`/claims/history?${params.toString()}`);
  if (result && Array.isArray(result) && result.length > 0) {
    return result;
  }
  return DEFAULT_DEMO_CLAIMS;
}


export async function getHighRiskClaims(limit: number = 50) {
  const result = await fetchWithAuth(`/claims/high-risk?limit=${limit}`);
  if (result && Array.isArray(result) && result.length > 0) {
    return result;
  }
  return DEFAULT_DEMO_CLAIMS.filter((c: any) => c.overall_risk_score >= 50.0);
}


export async function getClaimById(claimId: number) {
  const result = await fetchWithAuth(`/claims/${claimId}`);
  return result || null;
}

export async function getSingleClaim(claimId: number) {
  return await getClaimById(claimId);
}

export async function getClaimsList(query?: string | null) {
  return await getClaimsHistory(100, query);
}

export async function getDashboardData() {
  const [currentUser, summaryRaw, recentClaimsRaw] = await Promise.all([
    getCurrentUser(),
    getClaimsStats(),
    getClaimsHistory(10),
  ]);

  const recentClaims: any[] = (recentClaimsRaw && Array.isArray(recentClaimsRaw)) ? recentClaimsRaw : [];

  const total_claims = summaryRaw?.total_claims ?? recentClaims.length;
  const high_risk_count = summaryRaw?.high_risk_count ?? recentClaims.filter((c: any) => c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high"))).length;
  const avg_risk_score = summaryRaw?.avg_risk_score ?? roundVal(recentClaims.reduce((acc: number, c: any) => acc + (c.overall_risk_score || 0), 0) / (total_claims || 1), 1);
  const avg_claim_amount = summaryRaw?.avg_claim_amount ?? Math.round(recentClaims.reduce((acc: number, c: any) => acc + (c.claim_amount || 0), 0) / (total_claims || 1));

  const summary = summaryRaw || {
    total_claims,
    high_risk_count,
    avg_risk_score,
    avg_claim_amount,
  };

  const monthlyTrend = (summary.claims_by_month && summary.claims_by_month.length > 0)
    ? summary.claims_by_month
    : [
        { month: "Aug 2026", claims: total_claims },
      ];

  const damageClaim = recentClaims.find((c: any) => c.damage_score != null || c.damage_severity != null) || recentClaims[0] || null;
  const latestDamage = damageClaim ? {
    claimId: damageClaim.id,
    severity: damageClaim.damage_severity || "Moderate",
    score: damageClaim.damage_score || 55.0,
    vehicle: damageClaim.vehicle_make_model,
    customer: damageClaim.customer_name,
    imageData: damageClaim.image_data || null
  } : null;

  const activityFeed = recentClaims.slice(0, 5).map((c: any) => ({
    id: c.id,
    title: `Claim #${c.id} Processed`,
    subtitle: `${c.customer_name || "Customer"} - ${c.vehicle_make_model || "Vehicle"} (₹${(c.claim_amount || 0).toLocaleString("en-IN")})`,
    time: "Recently",
    riskBand: c.risk_band || "Low risk",
  }));

  return {
    summary,
    recentClaims,
    monthlyTrend,
    latestDamage,
    activityFeed,
    currentUser,
  };
}


function roundVal(val: number, decimals: number): number {
  return Number(Math.round(Number(val + "e" + decimals)) + "e-" + decimals);
}


export async function getAnalyticsData() {
  const [summaryRaw, claimsRaw] = await Promise.all([
    getClaimsStats(),
    getClaimsHistory(100),
  ]);

  const summary = summaryRaw || {
    total_claims: 0,
    high_risk_count: 0,
    avg_risk_score: 0,
    avg_claim_amount: 0,
  };

  const claims: any[] = claimsRaw || [];

  const total_claim_amount = claims.reduce((acc, c) => acc + (c.claim_amount || 0), 0);
  const high_risk_percentage = summary.total_claims > 0
    ? Math.round((summary.high_risk_count / summary.total_claims) * 100)
    : 0;

  const risk_band_breakdown = [
    { label: "Low Risk", count: claims.filter((c) => (c.overall_risk_score < 30.0 || (c.risk_band && c.risk_band.toLowerCase().includes("low")))).length },
    { label: "Medium Risk", count: claims.filter((c) => (c.overall_risk_score >= 30.0 && c.overall_risk_score < 50.0) || (c.risk_band && c.risk_band.toLowerCase().includes("medium"))).length },
    { label: "High Risk", count: claims.filter((c) => (c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high")))).length },
  ];


  const policy_type_breakdown = [
    { label: "Comprehensive", count: claims.filter((c) => c.policy_type === "Comprehensive").length },
    { label: "Third-Party", count: claims.filter((c) => c.policy_type === "Third-Party").length },
    { label: "Zero-Dep", count: claims.filter((c) => c.policy_type === "Zero-Dep").length },
  ];

  const fault_breakdown = [
    { label: "Policy Holder", count: claims.filter((c) => c.fault === "Policy Holder").length },
    { label: "Third Party", count: claims.filter((c) => c.fault === "Third Party").length },
  ];

  const area_breakdown = [
    { label: "Urban", count: claims.filter((c) => c.accident_area === "Urban").length },
    { label: "Rural", count: claims.filter((c) => c.accident_area === "Rural").length },
    { label: "Highway", count: claims.filter((c) => c.accident_area === "Highway").length },
  ];

  return {
    total_claims: summary.total_claims,
    high_risk_percentage,
    avg_claim_amount: summary.avg_claim_amount,
    total_claim_amount,
    risk_band_breakdown,
    policy_type_breakdown,
    fault_breakdown,
    area_breakdown,
  };
}
