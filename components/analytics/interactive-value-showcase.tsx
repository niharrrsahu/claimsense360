"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Scale, ArrowRight, CheckCircle2, TrendingUp, Users, Sparkles } from "lucide-react";
import Link from "next/link";

export default function InteractiveValueShowcase() {
  const [activeTab, setActiveTab] = useState<"speed" | "fraud" | "audit">("speed");
  const [claimsVolume, setClaimsVolume] = useState<number>(500);
  const [avgClaimValue, setAvgClaimValue] = useState<number>(120000);

  const annualFraudSavings = Math.round(claimsVolume * avgClaimValue * 0.08 * 12);
  const annualHoursSaved = Math.round(claimsVolume * 3.5 * 12);


  return (
    <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-6">
      
      {/* Header + Interactive Tab Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#173B32]/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#E66A4E]" />
            <span className="rounded-full bg-[#173B32]/10 px-3 py-0.5 text-xs font-bold text-[#173B32] uppercase tracking-wider">
              Interactive Enterprise Value Matrix
            </span>
          </div>
          <h3 className="mt-2 text-xl font-serif font-bold text-[#173B32]">
            Why Insurance Leaders Choose ClaimSense 360
          </h3>
        </div>

        {/* 3 Interactive Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-[#F4F1EA] p-1 border border-[#173B32]/10 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("speed")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              activeTab === "speed"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#173B32]/70 hover:bg-[#173B32]/10 hover:text-[#173B32]"
            }`}
          >
            <Zap size={14} /> ⚡ 3-Sec Fast Payouts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fraud")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              activeTab === "fraud"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#173B32]/70 hover:bg-[#173B32]/10 hover:text-[#173B32]"
            }`}
          >
            <ShieldCheck size={14} /> 🛡️ ₹1.8 Cr Fraud Saved
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#173B32]/70 hover:bg-[#173B32]/10 hover:text-[#173B32]"
            }`}
          >
            <Scale size={14} /> ⚖️ SHAP Audit Proof
          </button>
        </div>
      </div>

      {/* Dynamic Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === "speed" && (
          <motion.div
            key="speed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Visual Card 1 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Cycle Time</span>
                <span className="rounded-full bg-[#173B32] px-2.5 py-0.5 text-[10px] font-bold text-[#C9FF3D]">
                  85% Faster
                </span>
              </div>
              <h4 className="text-2xl font-serif font-extrabold text-[#173B32]">14 Days → 3 Sec</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                Low-risk claims (Score &lt; 30) bypass manual queues and auto-approve instantly for direct customer payout.
              </p>
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-[#173B32] mb-1">
                  <span>Auto Approval Rate</span>
                  <span>72.4%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-[#173B32] w-[72.4%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Visual Card 2 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Adjuster Workload</span>
                <span className="rounded-full bg-[#173B32] px-2.5 py-0.5 text-[10px] font-bold text-[#C9FF3D]">
                  -65% Stress
                </span>
              </div>
              <h4 className="text-2xl font-serif font-extrabold text-[#173B32]">10 Adjusters = 50</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                Human agents focus 100% of their time on complex high-risk fraud cases while routine claims clear automatically.
              </p>
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-[#173B32] mb-1">
                  <span>Workload Automation</span>
                  <span>65%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-[#3D9B62] w-[65%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Visual Card 3 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Try Speed Test</span>
                <h4 className="text-lg font-serif font-bold text-[#173B32] mt-1">Submit Sample Claim</h4>
                <p className="text-xs text-[#101412]/80 leading-relaxed font-medium mt-2">
                  Experience instant 3-second XGBoost ML risk evaluation live on a new claim form.
                </p>
              </div>

              <Link
                href="/claims/new"
                style={{ color: "#C9FF3D" }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173B32] hover:bg-[#23584b] px-4 py-2.5 text-xs font-bold transition active:scale-95 shadow-xs"
              >
                <span style={{ color: "#C9FF3D" }} className="font-bold">Submit Instant Test Claim</span>
                <ArrowRight size={14} style={{ color: "#C9FF3D" }} />
              </Link>


            </div>
          </motion.div>
        )}

        {activeTab === "fraud" && (
          <motion.div
            key="fraud"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Visual Card 1 */}
            <div className="rounded-2xl border border-[#E66A4E]/20 bg-[#FDF0ED] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E66A4E] uppercase tracking-wider">Financial Loss Prevention</span>
                <span className="rounded-full bg-[#E66A4E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                  94.2% Precision
                </span>
              </div>
              <h4 className="text-2xl font-serif font-extrabold text-[#E66A4E]">₹1.8 Crores Saved</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                Stops fraudulent payouts before money leaves the bank by detecting staged crashes and inflated repair estimates.
              </p>
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-[#E66A4E] mb-1">
                  <span>Fraud Detection Accuracy</span>
                  <span>94.2%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-[#E66A4E] w-[94.2%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Visual Card 2 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Tri-Engine Fusion</span>
                <span className="rounded-full bg-[#173B32] px-2.5 py-0.5 text-[10px] font-bold text-[#C9FF3D]">
                  3 Models Active
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#173B32]">ML + NLP + Computer Vision</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                XGBoost tabular risk + TF-IDF text narrative suspicion + OpenCV vehicle damage edge density scoring.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="rounded-md bg-white border border-[#173B32]/15 px-2 py-0.5 text-[10px] font-bold text-[#173B32]">XGBoost</span>
                <span className="rounded-md bg-white border border-[#173B32]/15 px-2 py-0.5 text-[10px] font-bold text-[#173B32]">TF-IDF NLP</span>
                <span className="rounded-md bg-white border border-[#173B32]/15 px-2 py-0.5 text-[10px] font-bold text-[#173B32]">OpenCV CV</span>
              </div>
            </div>

            {/* Visual Card 3 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">SIU Desk</span>
                <h4 className="text-lg font-serif font-bold text-[#173B32] mt-1">High-Risk Fraud Queue</h4>
                <p className="text-xs text-[#101412]/80 leading-relaxed font-medium mt-2">
                  Inspect flagged claims requiring immediate fraud investigation.
                </p>
              </div>

              <Link
                href="/fraud"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#E66A4E] hover:bg-[#d5593d] px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-xs"
              >
                <span>View Fraud Priority Queue</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {activeTab === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Visual Card 1 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Regulatory Compliance</span>
                <span className="rounded-full bg-[#173B32] px-2.5 py-0.5 text-[10px] font-bold text-[#C9FF3D]">
                  100% Compliant
                </span>
              </div>
              <h4 className="text-2xl font-serif font-extrabold text-[#173B32]">Zero Black-Box Risk</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                Insurance law prohibits rejecting claims without legal justification. SHAP provides exact mathematical proof.
              </p>
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-bold text-[#173B32] mb-1">
                  <span>Regulatory Audit Score</span>
                  <span>100%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full bg-[#173B32] w-[100%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Visual Card 2 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">Mathematical Proof</span>
                <span className="rounded-full bg-[#173B32] px-2.5 py-0.5 text-[10px] font-bold text-[#C9FF3D]">
                  SHAP Math
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold text-[#173B32]">SHAP TreeExplainer</h4>
              <p className="text-xs text-[#101412]/80 leading-relaxed font-medium">
                Every factor contribution (+28% Past Claims, +16% Night Crash, -15% High Driver Rating) is legally verifiable.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="rounded-md bg-[#FDF0ED] text-[#E66A4E] px-2 py-0.5 text-[10px] font-bold">+28% Past Claims</span>
                <span className="rounded-md bg-[#EBF7EE] text-[#173B32] px-2 py-0.5 text-[10px] font-bold">-15% Rating</span>
              </div>
            </div>

            {/* Visual Card 3 */}
            <div className="rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-5 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">AI Assistant</span>
                <h4 className="text-lg font-serif font-bold text-[#173B32] mt-1">Ask AI Copilot</h4>
                <p className="text-xs text-[#101412]/80 leading-relaxed font-medium mt-2">
                  Ask conversational questions about any claim ID or customer record.
                </p>
              </div>

              <Link
                href="/copilot"
                style={{ color: "#C9FF3D" }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#173B32] hover:bg-[#23584b] px-4 py-2.5 text-xs font-bold transition active:scale-95 shadow-xs"
              >
                <span style={{ color: "#C9FF3D" }} className="font-bold">Launch AI Copilot</span>
                <ArrowRight size={14} style={{ color: "#C9FF3D" }} />
              </Link>


            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Interactive Executive ROI & Savings Calculator */}
      <div className="rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#173B32]/10 pb-3">
          <div>
            <span className="text-[10px] font-bold text-[#E66A4E] uppercase tracking-widest">Interactive Calculator</span>
            <h4 className="text-lg font-serif font-bold text-[#173B32]">Estimate Your Enterprise ROI &amp; Time Saved</h4>
          </div>
          <span className="rounded-full bg-[#173B32] px-3 py-1 text-xs font-bold text-[#C9FF3D]">
            Live Financial Simulator
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#173B32] mb-1.5">
                <span>Monthly Claim Volume:</span>
                <span className="text-[#E66A4E]">{claimsVolume} claims / month</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={claimsVolume}
                onChange={(e) => setClaimsVolume(Number(e.target.value))}
                className="w-full accent-[#173B32] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#173B32] mb-1.5">
                <span>Average Claim Value:</span>
                <span className="text-[#E66A4E]">₹{avgClaimValue.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min="25000"
                max="500000"
                step="5000"
                value={avgClaimValue}
                onChange={(e) => setAvgClaimValue(Number(e.target.value))}
                className="w-full accent-[#173B32] cursor-pointer"
              />
            </div>
          </div>

          {/* Dynamic ROI Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#173B32]/15 bg-white p-3 sm:p-4 text-center min-w-0 overflow-hidden">
              <span className="text-[10px] font-bold text-[#173B32]/70 uppercase block truncate">Est. Annual Fraud Savings</span>
              <p className="mt-1 font-serif text-base sm:text-xl lg:text-2xl font-extrabold text-[#E66A4E] truncate max-w-full tracking-tight">
                ₹{annualFraudSavings.toLocaleString("en-IN")}
              </p>
              <span className="text-[9px] text-[#173B32]/60 font-semibold block truncate">Based on 8% fraud prevention</span>
            </div>

            <div className="rounded-xl border border-[#173B32]/15 bg-white p-3 sm:p-4 text-center min-w-0 overflow-hidden">
              <span className="text-[10px] font-bold text-[#173B32]/70 uppercase block truncate">Annual Adjuster Hours Saved</span>
              <p className="mt-1 font-serif text-base sm:text-xl lg:text-2xl font-extrabold text-[#173B32] truncate max-w-full tracking-tight">
                {annualHoursSaved.toLocaleString()} hrs
              </p>
              <span className="text-[9px] text-[#173B32]/60 font-semibold block truncate">3.5 hrs saved per claim</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

