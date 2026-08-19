"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlusCircle, FileText, ArrowRight } from "lucide-react";

export interface ClaimItemProps {
  id: number;
  customer_name?: string | null;
  vehicle_make_model?: string | null;
  claim_amount: number;
  overall_risk_score: number;
  risk_band: string;
  recommended_action: string;
}

interface RecentClaimsProps {
  claims?: ClaimItemProps[];
}

export default function RecentClaims({ claims = [] }: RecentClaimsProps) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-sans font-bold text-[#173B32]">Recent Claims Overview</h3>
          <p className="mt-1 text-xs text-[#173B32]/70 font-medium">
            Latest claims submitted and processed by AI engines • Click any row to inspect
          </p>
        </div>
        <Link
          href="/claims"
          className="text-xs font-bold text-[#173B32] hover:text-[#E66A4E] transition-colors flex items-center gap-1"
        >
          View Directory &rarr;
        </Link>
      </div>

      {claims.length === 0 ? (
        <div className="mt-8 flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center">
          <FileText className="h-8 w-8 text-[#173B32]/50 mb-2" />
          <p className="text-sm font-bold text-[#173B32]">No claims recorded yet.</p>
          <p className="mt-1 text-xs text-[#173B32]/70 font-medium">
            Submit a new claim to see real-time fraud predictions and analytics.
          </p>
          <Link
            href="/claims/new"
            className="mt-4 text-xs font-bold text-[#E66A4E] underline"
          >
            Submit First Claim &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#173B32]/10">
          <table className="w-full text-left text-sm min-w-[650px]">
            <thead className="bg-[#F4F1EA] border-b border-[#173B32]/15 text-xs font-bold uppercase tracking-wider text-[#173B32]">
              <tr>
                <th className="py-3.5 px-4 min-w-[100px]">Claim ID</th>
                <th className="py-3.5 px-4 min-w-[130px]">Customer</th>
                <th className="py-3.5 px-4 min-w-[140px]">Vehicle</th>
                <th className="py-3.5 px-4 min-w-[110px]">Claim Amount</th>
                <th className="py-3.5 px-4 min-w-[130px]">Risk Band</th>
                <th className="py-3.5 px-4 min-w-[160px]">Action</th>
                <th className="py-3.5 px-4 text-right">View</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#173B32]/10">
              {claims.map((claim) => {
                const score = claim.overall_risk_score ?? 0;
                const bandLower = (claim.risk_band || "").toLowerCase();
                let badgeClass = "bg-[#EBF7EE] text-[#173B32] border-[#173B32]/30 font-bold";
                let displayLabel = "Ultra-Low risk";
                
                if (score >= 60.0 || bandLower.includes("high")) {
                  badgeClass = "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/40 font-bold shadow-2xs";
                  displayLabel = "High risk";
                } else if (score >= 40.0 || bandLower.includes("moderate") || bandLower.includes("medium")) {
                  badgeClass = "bg-[#FFF8E6] text-[#D99A24] border-[#D99A24]/40 font-bold shadow-2xs";
                  displayLabel = "Moderate risk";
                } else if (score >= 20.0) {
                  badgeClass = "bg-[#EAF3FF] text-[#1E40AF] border-[#1E40AF]/30 font-bold shadow-2xs";
                  displayLabel = "Low risk";
                }

                return (
                  <motion.tr
                    key={claim.id}
                    whileHover={{ scale: 1.002, backgroundColor: "rgba(23,59,50,0.06)" }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => router.push(`/claims/${claim.id}`)}
                    transition={{ duration: 0.15 }}
                    className="group cursor-pointer transition-colors odd:bg-white even:bg-[#F4F1EA]/40 border-b border-[#173B32]/10"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#173B32] group-hover:text-[#E66A4E] transition-colors">
                      CLM-{String(claim.id).padStart(5, "0")}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#101412]">
                      {claim.customer_name || "Anonymous"}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-medium text-[#173B32]/80">
                      {claim.vehicle_make_model || "N/A"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#101412]">
                      ₹{claim.claim_amount?.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${badgeClass}`}>
                        {displayLabel} ({claim.overall_risk_score})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-[#173B32]/90">
                      {claim.recommended_action}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#F4F1EA] text-[#173B32] group-hover:bg-[#173B32] transition-all duration-200 group-hover:scale-110 shadow-xs"
                      >
                        <ArrowRight className="h-4 w-4 text-[#173B32] group-hover:text-[#C9FF3D] transition-colors duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
}