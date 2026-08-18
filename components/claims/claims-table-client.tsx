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
    <div className="space-y-6">
      {/* Interactive Search Banner */}
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
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
              className="rounded-2xl border border-[#173B32]/20 bg-white hover:bg-[#F4F1EA] px-4 py-3 text-xs font-bold text-[#E66A4E] shadow-2xs transition active:scale-95 cursor-pointer"
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
      <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 sm:p-8 shadow-sm">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#173B32]/10 text-xs font-semibold uppercase tracking-wider text-[#173B32]/70">
                <tr>
                  <th className="pb-3">Claim Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Claim Amount</th>
                  <th className="pb-3">Fraud Risk</th>
                  <th className="pb-3">Recommended Action</th>
                  <th className="pb-3 text-right">Details</th>
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
                      whileHover={{ scale: 1.006, x: 2 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => router.push(`/claims/${claim.id}`)}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="group cursor-pointer transition-all duration-200 hover:bg-[#173B32]/5"
                    >
                      <td className="py-4 px-2 font-mono font-bold text-[#173B32] group-hover:text-[#E66A4E] transition-colors rounded-l-xl">
                        CLM-{String(claim.id).padStart(5, "0")}
                      </td>

                      <td className="py-4 font-bold text-[#101412]">
                        {claim.customer_name || "Anonymous"}
                      </td>

                      <td className="py-4 text-[#173B32]/80 font-medium">
                        {claim.vehicle_make_model || "N/A"}
                      </td>

                      <td className="py-4 font-bold text-[#101412]">
                        ₹{claim.claim_amount?.toLocaleString("en-IN")}
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${badgeClass}`}
                        >
                          {displayLabel} ({claim.overall_risk_score})
                        </span>
                      </td>

                      <td className="py-4 text-xs font-semibold text-[#173B32]">
                        {claim.recommended_action || "Standard Review"}
                      </td>

                      <td className="py-4 px-2 text-right rounded-r-xl">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-[#F4F1EA] text-[#173B32] group-hover:bg-[#173B32] transition-all duration-200 group-hover:scale-110 shadow-xs">
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
    </div>
  );
}
