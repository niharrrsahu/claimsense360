"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, ShieldAlert, FileText, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BreakdownBarChart from "@/components/analytics/breakdown-bar-chart";
import StatCard from "@/components/dashboard/stat-card";

interface ClaimItem {
  id: number;
  customer_name?: string | null;
  vehicle_make_model?: string | null;
  claim_amount: number;
  vehicle_price: number;
  overall_risk_score: number;
  risk_band: string;
  policy_type: string;
  fault: string;
  accident_area: string;
  police_report_filed: boolean;
  witness_present: boolean;
  incident_description?: string | null;
  recommended_action: string;
}

interface AnalyticsFilterExplorerProps {
  initialClaims: ClaimItem[];
}

export default function AnalyticsFilterExplorer({ initialClaims = [] }: AnalyticsFilterExplorerProps) {
  const [selectedRisk, setSelectedRisk] = useState<string>("all");
  const [selectedPolicy, setSelectedPolicy] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedPolice, setSelectedPolice] = useState<string>("all");

  const resetFilters = () => {
    setSelectedRisk("all");
    setSelectedPolicy("all");
    setSelectedArea("all");
    setSelectedPolice("all");
  };

  const filteredClaims = useMemo(() => {
    return initialClaims.filter((claim) => {
      const score = claim.overall_risk_score ?? 0;
      const bandLower = (claim.risk_band || "").toLowerCase();

      // Risk Level Filter
      if (selectedRisk === "high" && !(score >= 50.0 || bandLower.includes("high"))) return false;
      if (selectedRisk === "medium" && !((score >= 30.0 && score < 50.0) || bandLower.includes("medium"))) return false;
      if (selectedRisk === "low" && !(score < 30.0 || bandLower.includes("low"))) return false;

      // Policy Type Filter
      if (selectedPolicy !== "all" && (claim.policy_type || "").toLowerCase() !== selectedPolicy.toLowerCase()) return false;

      // Accident Area Filter
      if (selectedArea !== "all" && (claim.accident_area || "").toLowerCase() !== selectedArea.toLowerCase()) return false;

      // Police Report Filter
      if (selectedPolice === "filed" && !claim.police_report_filed) return false;
      if (selectedPolice === "not_filed" && claim.police_report_filed) return false;

      return true;
    });
  }, [initialClaims, selectedRisk, selectedPolicy, selectedArea, selectedPolice]);

  // Recalculated Dynamic Metrics
  const totalClaimsCount = filteredClaims.length;
  const totalFinancialValue = filteredClaims.reduce((acc, c) => acc + (c.claim_amount || 0), 0);
  const avgRiskScore = totalClaimsCount > 0
    ? roundVal(filteredClaims.reduce((acc, c) => acc + (c.overall_risk_score || 0), 0) / totalClaimsCount, 1)
    : 0;
  const highRiskCount = filteredClaims.filter((c) => (c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high")))).length;
  const highRiskPercentage = totalClaimsCount > 0 ? Math.round((highRiskCount / totalClaimsCount) * 100) : 0;

  // Recalculated Chart Breakdowns
  const riskBreakdown = [
    { label: "Low Risk", count: filteredClaims.filter((c) => c.overall_risk_score < 30.0 || (c.risk_band && c.risk_band.toLowerCase().includes("low"))).length },
    { label: "Medium Risk", count: filteredClaims.filter((c) => (c.overall_risk_score >= 30.0 && c.overall_risk_score < 50.0) || (c.risk_band && c.risk_band.toLowerCase().includes("medium"))).length },
    { label: "High Risk", count: filteredClaims.filter((c) => c.overall_risk_score >= 50.0 || (c.risk_band && c.risk_band.toLowerCase().includes("high"))).length },
  ];

  const policyBreakdown = [
    { label: "Comprehensive", count: filteredClaims.filter((c) => (c.policy_type || "").toLowerCase() === "comprehensive").length },
    { label: "Third-Party", count: filteredClaims.filter((c) => (c.policy_type || "").toLowerCase() === "third-party").length },
    { label: "Zero-Dep", count: filteredClaims.filter((c) => (c.policy_type || "").toLowerCase() === "zero-dep").length },
  ];

  const faultBreakdown = [
    { label: "Policy Holder", count: filteredClaims.filter((c) => (c.fault || "").toLowerCase() === "policy holder").length },
    { label: "Third Party", count: filteredClaims.filter((c) => (c.fault || "").toLowerCase() === "third party").length },
  ];

  const areaBreakdown = [
    { label: "Urban", count: filteredClaims.filter((c) => (c.accident_area || "").toLowerCase() === "urban").length },
    { label: "Rural", count: filteredClaims.filter((c) => (c.accident_area || "").toLowerCase() === "rural").length },
    { label: "Highway", count: filteredClaims.filter((c) => (c.accident_area || "").toLowerCase() === "highway").length },
  ];

  const isFiltered = selectedRisk !== "all" || selectedPolicy !== "all" || selectedArea !== "all" || selectedPolice !== "all";

  return (
    <div className="space-y-6">
      
      {/* Interactive Multi-Filter Control Panel */}
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#173B32]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B32] text-[#C9FF3D]">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#173B32]">
                Interactive Portfolio Risk Explorer
              </h3>
              <p className="text-xs text-[#173B32]/70 font-medium">
                Filter across risk scores, policy tiers, incident zones, and police report status
              </p>
            </div>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-[#E66A4E]/30 bg-[#FDF0ED] px-3.5 py-1.5 text-xs font-bold text-[#E66A4E] hover:bg-[#E66A4E] hover:text-white transition active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <RotateCcw size={14} /> Reset All Filters
            </button>
          )}
        </div>

        {/* 4 Multi-Filter Control Columns */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          
          {/* Risk Level Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
              Risk Classification
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full rounded-2xl border border-[#173B32]/20 bg-[#F4F1EA] px-3.5 py-2.5 text-xs font-bold text-[#101412] outline-none focus:border-[#173B32] transition cursor-pointer"
            >
              <option value="all">All Risk Bands (0 - 100)</option>
              <option value="high">🔴 High Risk Only (Score ≥ 50)</option>
              <option value="medium">🟡 Medium Risk (Score 30-49)</option>
              <option value="low">🟢 Low Risk (Score &lt; 30)</option>
            </select>
          </div>

          {/* Policy Type Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
              Policy Tier
            </label>
            <select
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
              className="w-full rounded-2xl border border-[#173B32]/20 bg-[#F4F1EA] px-3.5 py-2.5 text-xs font-bold text-[#101412] outline-none focus:border-[#173B32] transition cursor-pointer"
            >
              <option value="all">All Policy Types</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="third-party">Third-Party</option>
              <option value="zero-dep">Zero-Dep Premium</option>
            </select>
          </div>

          {/* Incident Area Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
              Accident Geography
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-2xl border border-[#173B32]/20 bg-[#F4F1EA] px-3.5 py-2.5 text-xs font-bold text-[#101412] outline-none focus:border-[#173B32] transition cursor-pointer"
            >
              <option value="all">All Geographic Zones</option>
              <option value="urban">Urban Area</option>
              <option value="rural">Rural Zone</option>
              <option value="highway">High-Speed Highway</option>
            </select>
          </div>

          {/* Police Report Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
              Police Report Status
            </label>
            <select
              value={selectedPolice}
              onChange={(e) => setSelectedPolice(e.target.value)}
              className="w-full rounded-2xl border border-[#173B32]/20 bg-[#F4F1EA] px-3.5 py-2.5 text-xs font-bold text-[#101412] outline-none focus:border-[#173B32] transition cursor-pointer"
            >
              <option value="all">All Filings</option>
              <option value="filed">Official Police Report Filed ✓</option>
              <option value="not_filed">No Police Report Filed ⚠️</option>
            </select>
          </div>

        </div>
      </div>

      {/* Recalculated Metric Badges */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Matching Claims" value={totalClaimsCount.toString()} />
        <StatCard title="High Risk Rate" value={`${highRiskPercentage}%`} />
        <StatCard title="Avg Risk Score" value={`${avgRiskScore}/100`} />
        <StatCard title="Filtered Payout Value" value={`₹${totalFinancialValue.toLocaleString("en-IN")}`} />
      </div>

      {/* Dynamic Breakdown Charts (Recalculate Live) */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#173B32] mb-1">
            Claims Distribution by Risk Band
          </h3>
          <p className="text-xs text-[#173B32]/70 font-medium mb-5">Filtered breakdown by overall XGBoost fraud score</p>
          <BreakdownBarChart
            data={riskBreakdown}
            colors={["#173B32", "#D99A24", "#E66A4E"]}
            emptyText="No claims match active filter parameters."
          />
        </div>

        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#173B32] mb-1">
            Claims Volume by Policy Type
          </h3>
          <p className="text-xs text-[#173B32]/70 font-medium mb-5">Comprehensive vs Third-Party vs Zero-Dep</p>
          <BreakdownBarChart
            data={policyBreakdown}
            colors={["#173B32", "#E66A4E", "#8B5CF6"]}
            emptyText="No claims match active filter parameters."
          />
        </div>

        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#173B32] mb-1">
            Fault Allocation Distribution
          </h3>
          <p className="text-xs text-[#173B32]/70 font-medium mb-5">Policy Holder vs Third Party fault responsibility</p>
          <BreakdownBarChart
            data={faultBreakdown}
            colors={["#E66A4E", "#173B32"]}
            emptyText="No claims match active filter parameters."
          />
        </div>

        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#173B32] mb-1">
            Accident Area Geographic Distribution
          </h3>
          <p className="text-xs text-[#173B32]/70 font-medium mb-5">Urban vs Rural vs Highway accident zones</p>
          <BreakdownBarChart
            data={areaBreakdown}
            colors={["#173B32", "#D99A24", "#8B5CF6"]}
            emptyText="No claims match active filter parameters."
          />
        </div>
      </div>

      {/* Filtered Subset Claims Table */}
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#173B32]/10 pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#173B32]">
              Filtered Claims Subset ({filteredClaims.length})
            </h3>
            <p className="text-xs text-[#173B32]/70 font-medium">
              Live claims matching selected risk, policy, and geographic filters
            </p>
          </div>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center text-xs text-[#173B32]/70 font-medium">
            <ShieldAlert className="h-8 w-8 text-[#173B32]/50 mb-2" />
            No claims found matching active filter criteria. Try adjusting or resetting filters above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#173B32]/10 text-xs font-semibold uppercase tracking-wider text-[#173B32]/70">
                <tr>
                  <th className="pb-3">Claim Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Police Report</th>
                  <th className="pb-3">Risk Assessment</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173B32]/10">
                {filteredClaims.map((claim) => {
                  const score = claim.overall_risk_score ?? 0;
                  const bandLower = (claim.risk_band || "").toLowerCase();
                  let badgeClass = "bg-[#EBF7EE] text-[#173B32] border-[#173B32]/30 font-bold";
                  let displayLabel = "Ultra-Low risk";
                  
                  if (score >= 60.0 || bandLower.includes("high")) {
                    badgeClass = "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/40 font-bold";
                    displayLabel = "High risk";
                  } else if (score >= 40.0 || bandLower.includes("moderate") || bandLower.includes("medium")) {
                    badgeClass = "bg-[#FFF8E6] text-[#D99A24] border-[#D99A24]/40 font-bold";
                    displayLabel = "Moderate risk";
                  } else if (score >= 20.0) {
                    badgeClass = "bg-[#EAF3FF] text-[#1E40AF] border-[#1E40AF]/30 font-bold";
                    displayLabel = "Low risk";
                  }


                  return (
                    <tr key={claim.id} className="transition hover:bg-[#F4F1EA]/50">
                      <td className="py-3 font-mono font-bold text-[#173B32]">
                        CLM-{String(claim.id).padStart(5, "0")}
                      </td>
                      <td className="py-3 font-bold text-[#101412]">
                        {claim.customer_name || "Anonymous"}
                      </td>
                      <td className="py-3 text-[#173B32]/80 font-medium">
                        {claim.vehicle_make_model || "N/A"}
                      </td>
                      <td className="py-3 font-bold text-[#101412]">
                        ₹{claim.claim_amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-xs font-semibold">
                        {claim.police_report_filed ? (
                          <span className="text-[#173B32] font-bold">Filed ✓</span>
                        ) : (
                          <span className="text-[#E66A4E] font-bold">Not Filed ⚠️</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${badgeClass}`}>
                          {displayLabel} ({claim.overall_risk_score})
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/claims/${claim.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#173B32] hover:text-[#E66A4E] underline"
                        >
                          Audit <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

function roundVal(val: number, decimals: number = 1): number {
  return Number(Math.round(Number(val + "e" + decimals)) + "e-" + decimals);
}
