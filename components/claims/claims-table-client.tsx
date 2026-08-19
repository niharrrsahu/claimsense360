"use client";


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, FileText, ArrowRight } from "lucide-react";

interface ClaimRowProps {
  id: number;
  customer_name?: string | null;
  vehicle_make_model?: string | null;
  claim_amount: number;
  overall_risk_score: number;
  risk_band?: string | null;
  recommended_action?: string | null;
}

export default function ClaimsTableClient({
  initialClaims,
  initialQuery = "",
}: {
  initialClaims: ClaimRowProps[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const filteredClaims = initialClaims.filter((claim) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const idStr = `clm-${String(claim.id).padStart(5, "0")}`.toLowerCase();
    const name = (claim.customer_name || "").toLowerCase();
    const vehicle = (claim.vehicle_make_model || "").toLowerCase();
    return idStr.includes(q) || name.includes(q) || vehicle.includes(q);
  });

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Interactive Search Banner */}
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] focus-within:border-[#173B32] transition">
            <Search className="text-[#173B32]/60" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, vehicle, or claim ref (e.g. CLM-00001)..."
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="rounded-2xl border border-[#173B32]/20 bg-white hover:bg-[#F4F1EA] px-4 py-3 text-xs font-bold text-[#E66A4E] shadow-2xs transition active:scale-95 cursor-pointer shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="mt-3 flex items-center justify-between text-xs text-[#173B32]/70 font-medium">
            <span>
              Showing <strong>{filteredClaims.length}</strong> matching claims for &quot;<strong className="text-[#173B32]">{searchTerm}</strong>&quot;
            </span>
          </div>
        )}
      </div>

      {/* Claims Directory Table */}
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-4 sm:p-8 shadow-sm max-w-full overflow-hidden">
        {filteredClaims.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center">
            <FileText className="h-10 w-10 text-[#173B32]/50 mb-3" />
            <h3 className="text-base font-bold text-[#173B32]">No claims found</h3>
            <p className="mt-1 text-xs text-[#173B32]/70 font-medium max-w-sm">
              {searchTerm
                ? `No matching claims found for "${searchTerm}". Try a different keyword.`
                : "No claims have been submitted into the database yet."}
            </p>
            <Link
              href="/claims/new"
              className="mt-4 text-xs font-bold text-[#E66A4E] underline"
            >
              Submit New Claim &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {filteredClaims.map((claim) => {
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
                  <motion.div
                    key={claim.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/claims/${claim.id}`)}
                    className="rounded-2xl border border-[#173B32]/12 bg-[#F4F1EA] p-4 space-y-3 cursor-pointer shadow-xs active:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-[#173B32] bg-white px-2.5 py-1 rounded-lg border border-[#173B32]/15">
                        CLM-{String(claim.id).padStart(5, "0")}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] border ${badgeClass}`}>
                        {displayLabel} ({score.toFixed(1)})
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#173B32]/10 pb-2">
                      <div>
                        <h4 className="text-sm font-bold text-[#101412]">{claim.customer_name || "N/A"}</h4>
                        <p className="text-xs text-[#173B32]/70 font-medium">{claim.vehicle_make_model || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs uppercase font-bold text-[#173B32]/60 block">Claim Value</span>
                        <span className="text-sm font-extrabold text-[#101412]">₹{Number(claim.claim_amount || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-[#173B32]/80">
                        {claim.recommended_action || "Approve automatically"}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-[#173B32]">
                        View Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[#173B32]/10">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-[#F4F1EA] border-b border-[#173B32]/15 text-xs font-bold uppercase tracking-wider text-[#173B32]">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[110px]">Claim Ref</th>
                    <th className="py-3.5 px-4 min-w-[140px]">Customer</th>
                    <th className="py-3.5 px-4 min-w-[150px]">Vehicle</th>
                    <th className="py-3.5 px-4 min-w-[120px]">Claim Amount</th>
                    <th className="py-3.5 px-4 min-w-[140px]">Fraud Risk</th>
                    <th className="py-3.5 px-4 min-w-[190px]">Recommended Action</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#173B32]/10">
                  {filteredClaims.map((claim) => {
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
                        <td className="py-3.5 px-4 font-semibold text-[#101412]">
                          {claim.customer_name || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-[#173B32]/80">
                          {claim.vehicle_make_model || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#101412]">
                          ₹{Number(claim.claim_amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs border ${badgeClass}`}>
                            {displayLabel} ({score.toFixed(1)})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-[#173B32]/90">
                          {claim.recommended_action || "Approve automatically"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#101412]/5 text-[#101412] transition-all group-hover:bg-[#173B32] group-hover:text-[#C9FF3D]">
                            <ArrowRight size={14} />
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
