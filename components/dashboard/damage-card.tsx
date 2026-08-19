"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertCircle, Sparkles } from "lucide-react";

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

const SAMPLE_DAMAGES = [
  {
    claimId: 1,
    vehicle: "Honda City (2022)",
    customer: "Rahul Sharma",
    score: 18.5,
    severity: "Minor Bumper Scuff",
    badge: "bg-[#EBF7EE] text-[#173B32] border-[#173B32]/30",
    description: "Minor superficial scratch on lower front bumper. Structural integrity 100% intact.",
  },
  {
    claimId: 2,
    vehicle: "Hyundai Creta (2021)",
    customer: "Priya Patel",
    score: 42.0,
    severity: "Moderate Door Dent",
    badge: "bg-[#FFF8E6] text-[#D99A24] border-[#D99A24]/40",
    description: "Side door panel dent with paint cracking. Requires secondary photo verification.",
  },
  {
    claimId: 3,
    vehicle: "BMW 3 Series (2023)",
    customer: "Amit Verma",
    score: 74.2,
    severity: "Severe Frontal Impact",
    badge: "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/40",
    description: "Radiator crush with headlight housing fracture. High risk indicator present.",
  },
];

export default function DamageCard({ latestDamage }: DamageCardProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeDamage = SAMPLE_DAMAGES[selectedIdx];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
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
            CV Heuristic
          </span>
        </div>

        {/* Interactive Claim Switcher Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#173B32]/70 uppercase tracking-wider">Inspect:</span>
          {SAMPLE_DAMAGES.map((item, idx) => (
            <button
              key={item.claimId}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedIdx === idx
                  ? "bg-[#173B32] text-[#C9FF3D] shadow-xs scale-105"
                  : "bg-[#F4F1EA] text-[#173B32] hover:bg-[#173B32]/10"
              }`}
            >
              CLM-0000{item.claimId}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDamage.claimId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
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

          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}