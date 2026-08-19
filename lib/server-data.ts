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

const DEFAULT_DEMO_CLAIMS = Array.from({ length: 41 }, (_, idx) => {
  const claimNum = 41 - idx;
  const idStr = claimNum.toString().padStart(5, "0");
  const isHighRisk = idx % 2 === 0;
  const isLow = idx % 3 === 0;
  
  const customerNames = [
    "Rajesh Kumar", "Priya Patel", "Vikram Malhotra", "Ananya Sharma", 
    "Siddharth Rao", "Neha Gupta", "Amitabh Singh", "Kavita Reddy"
  ];
  const vehicles = [
    "Saab 92x (2004)", "Mercedes E400 (2007)", "Hyundai Creta 1.5 SX", 
    "Dodge Neon (2007)", "Honda City 1.5 i-VTEC", "Tata Harrier XZA+", "Mahindra Thar LX"
  ];

  const customer_name = customerNames[idx % customerNames.length];
  const vehicle_make_model = vehicles[idx % vehicles.length];
  const overall_risk_score = isHighRisk ? roundVal(60.9 + (idx % 15) * 2.1, 1) : roundVal(15.2 + (idx % 10) * 1.2, 1);
  const claim_amount = isHighRisk ? 71610 : 5070;
  const risk_band = overall_risk_score >= 50.0 ? "High risk" : "Ultra-Low risk";
  const recommended_action = overall_risk_score >= 50.0 ? "High-priority Investigation" : "Approve automatically";

  return {
    id: claimNum,
    claim_id: `CLM-${idStr}`,
    customer_name,
    vehicle_make_model,
    age: 35 + (idx % 15),
    vehicle_price: isHighRisk ? 850000 : 1800000,
    claim_amount,
    vehicle_age: 5 + (idx % 8),
    past_claims: isHighRisk ? 2 : 0,
    driver_rating: isHighRisk ? 2 : 4,
    policy_type: isHighRisk ? "Comprehensive" : "Zero-Dep",
    fault: isHighRisk ? "Policy Holder" : "Third Party",
    accident_area: isHighRisk ? "Urban" : "Rural",
    police_report_filed: !isHighRisk,
    witness_present: isHighRisk,
    incident_description: isHighRisk ? "Front impact collision reported on urban highway." : "Rear bumper scratch in parking area.",
    narrative_suspicion_score: overall_risk_score,
    fraud_probability: roundVal(overall_risk_score / 100, 2),
    fraud_score: overall_risk_score,
    overall_risk_score,
    risk_band,
    recommended_action,
    damage_severity: isHighRisk ? "Major Crush" : "Minor Scratch",
    damage_score: overall_risk_score,
    created_at: new Date(Date.now() - idx * 86400000).toISOString()
  };
});


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

  const summary = (summaryRaw && summaryRaw.total_claims > 0) ? summaryRaw : {
    total_claims: 41,
    high_risk_count: 21,
    avg_risk_score: 42.9,
    avg_claim_amount: 55101,
    claims_by_month: [
      { month: "Mar 2026", claims: 2 },
      { month: "Apr 2026", claims: 4 },
      { month: "May 2026", claims: 6 },
      { month: "Jun 2026", claims: 9 },
      { month: "Jul 2026", claims: 14 },
      { month: "Aug 2026", claims: 41 }
    ]
  };

  const monthlyTrend = summary.claims_by_month;


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

  const summary = (summaryRaw && summaryRaw.total_claims > 0) ? summaryRaw : {
    total_claims: 41,
    high_risk_count: 21,
    avg_risk_score: 42.9,
    avg_claim_amount: 55101,
  };

  const claims: any[] = (claimsRaw && claimsRaw.length > 0) ? claimsRaw : DEFAULT_DEMO_CLAIMS;


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
