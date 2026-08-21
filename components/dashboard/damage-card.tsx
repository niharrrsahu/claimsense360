"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface DamageCardProps {
  latestDamage?: {
    claimId?: number;
    severity?: string | null;
    score?: number | null;
    vehicle?: string | null;
    customer?: string | null;
    imageData?: string | null;
  } | null;
}


export default function DamageCard({ latestDamage }: DamageCardProps) {
  const activeDamage = latestDamage ? {
    claimId: latestDamage.claimId || 1,
    vehicle: latestDamage.vehicle || "Vehicle Claim",
    customer: latestDamage.customer || "Customer",
    score: latestDamage.score != null ? latestDamage.score : 18.5,
    severity: latestDamage.severity || "Minor Damage",
    badge: (latestDamage.score || 0) >= 50 ? "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/40" : "bg-[#EBF7EE] text-[#173B32] border-[#173B32]/30",
    description: `Computer Vision pixel analysis executed for ${latestDamage.vehicle || "vehicle"}. Damage severity score evaluated at ${latestDamage.score || 0}/100.`,
  } : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-[#173B32]/12 bg-white p-4 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-w-0"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B32]/10 text-[#173B32]">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-[#173B32]">Damage Analysis</h3>
              <p className="text-xs text-[#173B32]/70 font-medium">Computer Vision Pixel Scoring</p>
            </div>
          </div>

          <span className="rounded-full bg-[#173B32]/10 px-3 py-1 text-xs text-[#173B32] font-semibold">
            YOLOv8 CV
          </span>
        </div>

        {activeDamage ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-4 sm:p-5 min-w-0 overflow-hidden space-y-3">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs text-[#173B32]/70 font-medium shrink-0">Claim Reference:</span>
                <span className="text-xs font-mono font-bold text-[#173B32] truncate">
                  CLM-{String(activeDamage.claimId).padStart(5, "0")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs text-[#173B32]/70 font-medium shrink-0">Vehicle:</span>
                <span className="text-xs sm:text-sm font-bold text-[#101412] truncate">{activeDamage.vehicle}</span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#173B32]/10 pt-3 min-w-0">
                <span className="text-xs text-[#173B32]/70 font-medium shrink-0">CV Severity Score:</span>
                <span className="text-base sm:text-xl font-serif font-extrabold text-[#173B32] truncate">
                  {activeDamage.score} / 100
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-xs text-[#173B32]/70 font-medium shrink-0">Severity Band:</span>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold shrink-0 ${activeDamage.badge}`}>
                  {activeDamage.severity}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#173B32]/70 font-medium leading-relaxed">
              {activeDamage.description}
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center">
            <Camera className="h-8 w-8 text-[#173B32]/40" />
            <p className="mt-2 text-xs font-bold text-[#173B32]">No Damage Data Evaluated</p>
            <p className="mt-1 text-[11px] text-[#173B32]/60 max-w-xs">
              Submit a claim with a vehicle damage photo to run YOLOv8 computer vision analysis.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}