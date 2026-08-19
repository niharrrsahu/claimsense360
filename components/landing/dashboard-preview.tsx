"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface PresetScenario {
  id: string;
  claimId: string;
  customerName: string;
  fraudScore: number;
  fraudChange: string;
  riskBand: "Ultra-Low" | "Moderate" | "High";
  riskColor: string;
  claimAmount: string;
  damageSeverity: string;
  action: string;
  description: string;
  confidence: string;
}

const SCENARIOS: PresetScenario[] = [
  {
    id: "low",
    claimId: "CLM-48291",
    customerName: "Rahul Sharma",
    fraudScore: 18,
    fraudChange: "−12%",
    riskBand: "Ultra-Low",
    riskColor: "text-[#2E6B5B] bg-[#EAF4EE]",
    claimAmount: "₹72,500",
    damageSeverity: "Minor Scuff",
    action: "Fast-track settlement",
    description: "No significant fraud indicators detected. Vehicle damage evidence is consistent with submitted claim.",
    confidence: "97.8%",
  },
  {
    id: "moderate",
    claimId: "CLM-18492",
    customerName: "Priya Patel",
    fraudScore: 45,
    fraudChange: "+8%",
    riskBand: "Moderate",
    riskColor: "text-[#D99A24] bg-[#FFF8E6]",
    claimAmount: "₹1,85,000",
    damageSeverity: "Moderate Bumper",
    action: "Photo verification needed",
    description: "Minor discrepancy between police report time and claim submission. Secondary damage photo required.",
    confidence: "91.4%",
  },
  {
    id: "high",
    claimId: "CLM-99210",
    customerName: "Amit Verma",
    fraudScore: 82,
    fraudChange: "+34%",
    riskBand: "High",
    riskColor: "text-[#E66A4E] bg-[#FDF0ED]",
    claimAmount: "₹4,20,000",
    damageSeverity: "Severe Frontal",
    action: "Flag for SIU fraud audit",
    description: "Deceptive language detected in incident narrative. Past claims frequency spike matched across 3 policies.",
    confidence: "99.2%",
  },
];

export default function DashboardPreview() {
  const [selectedId, setSelectedId] = useState<string>("low");
  const [isAuditing, setIsAuditing] = useState(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];

  const handleSelect = (id: string) => {
    setIsAuditing(true);
    setSelectedId(id);
    setTimeout(() => setIsAuditing(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15 }}
      className="relative w-full max-w-[590px]"
    >
      {/* BACKGROUND DECORATION */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#E66A4E]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#2E6B5B]/10 blur-3xl pointer-events-none" />

      {/* MAIN PANEL */}
      <div className="relative overflow-hidden rounded-[32px] border border-[#173B32]/12 bg-white p-5 shadow-[0_30px_80px_rgba(23,59,50,0.12)]">

        {/* INTERACTIVE PRESET SELECTOR BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#173B32]/10 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B32]/60 shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-[#E66A4E]" /> Interactive Sandbox:
          </span>
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedId;
            return (
              <motion.button
                key={sc.id}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(sc.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#173B32] text-[#C9FF3D] border-[#173B32] shadow-xs"
                    : "bg-[#F4F1EA] text-[#173B32] border-[#173B32]/15 hover:bg-[#173B32]/10"
                }`}
              >
                {sc.riskBand === "Ultra-Low" ? "🟢" : sc.riskBand === "Moderate" ? "🟡" : "🔴"}{" "}
                {sc.claimId}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-4 space-y-4"
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A948F]">
                  Claim Intelligence • {activeScenario.customerName}
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-extrabold text-[#173B32]">
                  {activeScenario.claimId}
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#EAF4EE] px-3 py-1.5 text-xs font-bold text-[#2E6B5B] shadow-2xs">
                <span className={`h-2 w-2 rounded-full ${isAuditing ? "bg-[#E66A4E] animate-ping" : "bg-[#2E6B5B]"}`} />
                {isAuditing ? "Auditing Engine..." : "AI Analysis Active"}
              </div>
            </div>

            {/* SCORE AREA */}
            <div className="grid grid-cols-2 gap-4">
              {/* FRAUD RISK CARD */}
              <div className="rounded-[24px] bg-[#F4F1EA] p-4.5 border border-[#173B32]/10">
                <div className="flex items-start justify-between">
                  <p className="text-xs font-bold uppercase text-[#66736D] tracking-wider">
                    Fraud Risk Score
                  </p>
                  <span className="text-xs font-bold text-[#2E6B5B]">
                    {activeScenario.fraudChange}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <span className="font-serif text-4xl font-extrabold text-[#173B32]">
                    {activeScenario.fraudScore}
                  </span>
                  <span className="mb-1 text-xs text-[#66736D] font-bold">/ 100</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D9DED9]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeScenario.fraudScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      activeScenario.fraudScore >= 60
                        ? "bg-[#E66A4E]"
                        : activeScenario.fraudScore >= 40
                        ? "bg-[#D99A24]"
                        : "bg-[#2E6B5B]"
                    }`}
                  />
                </div>

                <p className={`mt-2.5 text-xs font-bold ${
                  activeScenario.fraudScore >= 60 ? "text-[#E66A4E]" : activeScenario.fraudScore >= 40 ? "text-[#D99A24]" : "text-[#2E6B5B]"
                }`}>
                  {activeScenario.riskBand} risk detected
                </p>
              </div>

              {/* CLAIM VALUE CARD */}
              <div className="rounded-[24px] bg-[#173B32] p-3.5 sm:p-4.5 text-[#F4F1EA] flex flex-col justify-between shadow-md min-w-0 overflow-hidden">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70 truncate">
                    Estimated Claim
                  </p>
                  <p className="mt-2 sm:mt-3 font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#C9FF3D] truncate max-w-full tracking-tight">
                    {activeScenario.claimAmount}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center justify-between text-[11px] sm:text-xs border-t border-white/10 pt-2.5 min-w-0">
                  <span className="text-white/60 font-medium truncate">Damage Severity</span>
                  <span className="font-bold text-[#F2C96D] truncate ml-1">
                    {activeScenario.damageSeverity}
                  </span>
                </div>
              </div>

            </div>

            {/* AI DECISION */}
            <div className="rounded-[24px] border border-[#173B32]/12 bg-[#F9F8F5] p-4.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A948F]">
                    AI Recommendation
                  </p>
                  <h4 className="mt-1 font-serif text-xl font-bold text-[#173B32]">
                    {activeScenario.action}
                  </h4>
                </div>

                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${activeScenario.riskColor} font-bold`}>
                  {activeScenario.fraudScore >= 60 ? <ShieldAlert size={20} /> : activeScenario.fraudScore >= 40 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                </div>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-[#66736D] font-medium">
                {activeScenario.description}
              </p>

              <div className="mt-3.5 flex items-center justify-between border-t border-[#173B32]/10 pt-3">
                <span className="text-xs text-[#8A948F] font-bold">AI Model Confidence</span>
                <span className="text-xs font-extrabold text-[#173B32]">{activeScenario.confidence}</span>
              </div>
            </div>

            {/* BOTTOM METRICS */}
            <div className="grid grid-cols-3 gap-2.5">
              <MiniMetric label="Claims" value="12.4K" />
              <MiniMetric label="Accuracy" value="97.8%" />
              <MiniMetric label="Time Saved" value="64%" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F4F1EA] p-3 text-center border border-[#173B32]/10">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A948F]">
        {label}
      </p>
      <p className="mt-1 font-serif text-base font-extrabold text-[#173B32]">
        {value}
      </p>
    </div>
  );
}