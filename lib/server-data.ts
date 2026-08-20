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

export async function getClaimsStats(excludeSeed: boolean = false) {
  const query = excludeSeed ? "?exclude_seed=true" : "";
  return await fetchWithAuth(`/claims/stats/summary${query}`);
}


export async function getClaimsHistory(limit: number = 50, query?: string | null, excludeSeed: boolean = false) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (query) {
    params.set("q", query);
  }
  if (excludeSeed) {
    params.set("exclude_seed", "true");
  }
  const result = await fetchWithAuth(`/claims/history?${params.toString()}`);
  if (result && Array.isArray(result)) {
    return result;
  }
  return [];
}

export async function getHighRiskClaims(limit: number = 50, excludeSeed: boolean = false) {
  const query = excludeSeed ? `&exclude_seed=true` : "";
  const result = await fetchWithAuth(`/claims/high-risk?limit=${limit}${query}`);
  if (result && Array.isArray(result)) {
    return result;
  }
  return [];
}

export async function getClaimById(claimId: number) {
  const result = await fetchWithAuth(`/claims/${claimId}`);
  if (result) return result;
  return null;
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
    getClaimsStats(false),
    getClaimsHistory(10, null, false),
  ]);

  const recentClaims: any[] = (recentClaimsRaw && Array.isArray(recentClaimsRaw)) ? recentClaimsRaw : [];

  const summary = summaryRaw || {
    total_claims: recentClaims.length,
    high_risk_count: recentClaims.filter((c: any) => c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high"))).length,
    avg_risk_score: recentClaims.length > 0 ? roundVal(recentClaims.reduce((acc: number, c: any) => acc + (c.overall_risk_score || 0), 0) / recentClaims.length, 1) : 0,
    avg_claim_amount: recentClaims.length > 0 ? Math.round(recentClaims.reduce((acc: number, c: any) => acc + (c.claim_amount || 0), 0) / recentClaims.length) : 0,
    claims_by_month: []
  };

  const monthlyTrend = summary.claims_by_month || [];

  const damageClaim = recentClaims.find((c: any) => c.damage_score != null || c.damage_severity != null) || recentClaims[0] || null;
  const latestDamage = damageClaim ? {
    claimId: damageClaim.id,
    severity: damageClaim.damage_severity || "Moderate",
    score: damageClaim.damage_score || 55.0,
    vehicle: damageClaim.vehicle_make_model,
    customer: damageClaim.customer_name,
    imageData: damageClaim.image_data || damageClaim.image_path || null
  } : null;

  const activityFeed = recentClaims.slice(0, 5).map((c: any) => ({
    id: c.id,
    title: `Claim #${c.id} Processed`,
    subtitle: `${c.customer_name || "Customer"} - ${c.vehicle_make_model || "Vehicle"} (₹${(c.claim_amount || 0).toLocaleString("en-IN")})`,
    time: "Recently",
    riskBand: c.risk_band || (c.overall_risk_score >= 50.0 ? "High risk" : "Low risk"),
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
    getClaimsStats(false),
    getClaimsHistory(100, null, false),
  ]);

  const claims: any[] = (claimsRaw && Array.isArray(claimsRaw)) ? claimsRaw : [];

  const summary = summaryRaw || {
    total_claims: claims.length,
    high_risk_count: claims.filter((c: any) => c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high"))).length,
    avg_risk_score: claims.length > 0 ? roundVal(claims.reduce((acc: number, c: any) => acc + (c.overall_risk_score || 0), 0) / claims.length, 1) : 0,
    avg_claim_amount: claims.length > 0 ? Math.round(claims.reduce((acc: number, c: any) => acc + (c.claim_amount || 0), 0) / claims.length) : 0,
  };

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

