"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight } from "lucide-react";


interface FraudClaimsListProps {
  highRiskClaims: any[];
}

export default function FraudClaimsList({ highRiskClaims }: FraudClaimsListProps) {
  const router = useRouter();
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "major">("all");

  const filteredList = highRiskClaims.filter((claim: any) => {
    const score = claim.overall_risk_score ?? 0;
    if (filterSeverity === "critical") return score >= 78.0;
    if (filterSeverity === "major") return score >= 50.0 && score < 78.0;
    return true;
  });

  if (highRiskClaims.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center">
        <ShieldAlert className="h-10 w-10 text-[#173B32]/50 mb-3" />
        <h3 className="text-base font-bold text-[#173B32]">No high risk claims detected</h3>
        <p className="mt-1 text-xs text-[#173B32]/70 font-medium max-w-sm">
          Great! There are currently no high-risk claims flagged with a fraud score &ge; 50 in the database.
        </p>
      </div>
    );
  }

  const criticalCount = highRiskClaims.filter((c: any) => c.overall_risk_score >= 78.0).length;
  const majorCount = highRiskClaims.filter((c: any) => c.overall_risk_score >= 50.0 && c.overall_risk_score < 78.0).length;

  return (
    <div className="space-y-6">
      {/* SIU Audit Severity Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#173B32]/10 pb-4">
        <button
          type="button"
          onClick={() => setFilterSeverity("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
            filterSeverity === "all"
              ? "bg-[#173B32] text-white shadow-sm"
              : "bg-[#F4F1EA] text-[#173B32]/80 hover:bg-[#173B32]/10"
          }`}
        >
          All Flagged Claims ({highRiskClaims.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterSeverity("critical")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
            filterSeverity === "critical"
              ? "bg-[#E66A4E] text-white shadow-sm"
              : "bg-[#FDF0ED] text-[#E66A4E] hover:bg-[#E66A4E]/20"
          }`}
        >
          🔴 Critical SIU Flag (Score ≥ 78) ({criticalCount})
        </button>

        <button
          type="button"
          onClick={() => setFilterSeverity("major")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
            filterSeverity === "major"
              ? "bg-[#D99A24] text-white shadow-sm"
              : "bg-[#FFF8E6] text-[#D99A24] hover:bg-[#D99A24]/20"
          }`}
        >
          🟡 Major SIU Flag (Score 50-77) ({majorCount})
        </button>
      </div>

      {filteredList.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center text-xs text-[#173B32]/70 font-medium">
          No high-risk claims matching the selected audit severity tab.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((claim: any, idx: number) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => router.push(`/claims/${claim.id}`)}
              className="group flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 transition-all duration-300 hover:border-[#E66A4E]/40 hover:bg-white hover:shadow-lg cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#173B32] group-hover:text-[#E66A4E] transition-colors">
                    CLM-{String(claim.id).padStart(5, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF0ED] border border-[#E66A4E]/30 px-3 py-0.5 text-xs font-bold text-[#E66A4E] shadow-2xs group-hover:scale-105 transition-transform">
                    <span className="h-2 w-2 rounded-full bg-[#E66A4E] animate-pulse" /> Risk Score: {claim.overall_risk_score}/100
                  </span>
                  <span className="text-xs font-bold text-[#101412]">
                    {claim.customer_name} ({claim.vehicle_make_model})
                  </span>
                </div>

                <p className="text-xs text-[#173B32]/70 font-medium line-clamp-1">
                  &quot;{claim.incident_description}&quot;
                </p>

                <div className="flex items-center gap-4 text-xs text-[#173B32]/70 pt-1 font-medium">
                  <span>Claim Amount: <strong>₹{claim.claim_amount?.toLocaleString("en-IN")}</strong></span>
                  <span>Policy: <strong>{claim.policy_type}</strong></span>
                  <span>Fault: <strong>{claim.fault}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <Link
                  href={`/claims/${claim.id}`}
                  className="flex items-center gap-2 rounded-xl bg-[#E66A4E] hover:bg-[#d5593d] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 active:scale-95 group-hover:scale-105"
                >
                  <span className="text-white font-bold">Deep Audit</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </Link>

                <Link
                  href={`/copilot?copilot_claim=${claim.id}`}
                  className="flex items-center gap-1.5 rounded-xl bg-[#173B32] hover:bg-[#23584b] px-4 py-2.5 text-xs font-bold text-[#C9FF3D] shadow-sm transition active:scale-95 group-hover:scale-105"
                >
                  <span className="text-[#C9FF3D] font-bold">🤖 AI Copilot Query</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

