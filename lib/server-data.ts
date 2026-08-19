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

export async function getClaimsHistory(limit: number = 50, query?: string | null) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (query) {
    params.set("q", query);
  }
  const result = await fetchWithAuth(`/claims/history?${params.toString()}`);
  if (result && Array.isArray(result)) {
    return result;
  }
  return [];
}

export async function getHighRiskClaims(limit: number = 50) {
  const result = await fetchWithAuth(`/claims/high-risk?limit=${limit}`);
  if (result && Array.isArray(result)) {
    return result;
  }
  return [];
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
