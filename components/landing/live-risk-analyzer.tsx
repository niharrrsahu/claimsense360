"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  FileWarning,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
} from "lucide-react";

type Factor = {
  label: string;
  contribution: number; // -100..100, positive pushes risk up
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function LiveRiskAnalyzer() {
  const [claimAmount, setClaimAmount] = useState(180000);
  const [vehicleAge, setVehicleAge] = useState(6);
  const [priorClaims, setPriorClaims] = useState(1);
  const [policeReport, setPoliceReport] = useState(true);
  const [witnessPresent, setWitnessPresent] = useState(true);

  const { score, factors, band } = useMemo(() => {
    const amountFactor = clamp((claimAmount / 500000) * 34, 0, 34);
    const ageFactor = clamp((vehicleAge / 20) * 18, 0, 18);
    const priorFactor = clamp((priorClaims / 5) * 26, 0, 26);
    const reportFactor = policeReport ? -6 : 16;
    const witnessFactor = witnessPresent ? -4 : 8;

    const raw =
      8 + amountFactor + ageFactor + priorFactor + reportFactor + witnessFactor;
    const score = Math.round(clamp(raw, 2, 98));

    const factors: Factor[] = [
      { label: "Claim amount", contribution: Math.round(amountFactor) },
      { label: "Vehicle age", contribution: Math.round(ageFactor) },
      { label: "Prior claims", contribution: Math.round(priorFactor) },
      { label: "Police report", contribution: Math.round(reportFactor) },
      { label: "Witness present", contribution: Math.round(witnessFactor) },
    ].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    const band =
      score < 20
        ? {
            name: "Ultra-Low risk",
            action: "Fast-track automatic payout",
            color: "#59d98a",
            Icon: ShieldCheck,
          }
        : score < 40
        ? {
            name: "Low risk",
            action: "Proceed to standard approval",
            color: "#3b82f6",
            Icon: ShieldCheck,
          }
        : score < 60
        ? {
            name: "Moderate risk",
            action: "Require photo verification",
            color: "#f2c96d",
            Icon: ShieldAlert,
          }
        : {
            name: "High risk",
            action: "Flag for SIU fraud audit",
            color: "#f28b6d",
            Icon: ShieldX,
          };


    return { score, factors, band };
  }, [claimAmount, vehicleAge, priorClaims, policeReport, witnessPresent]);

  const maxAbsContribution = Math.max(
    1,
    ...factors.map((f) => Math.abs(f.contribution))
  );

  return (
    <section
      id="intelligence"
      className="scroll-mt-36 relative overflow-hidden bg-[#0B1120] px-6 pt-28 pb-24 text-white sm:px-8 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32"
    >



      {/* AMBIENT GLOW */}
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#2E6B5B]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#C9FF3D]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#C9FF3D]"
          >
            <Sparkles size={14} />
            Try it live
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
          >
            Move the sliders,
            <span className="block italic text-[#C9FF3D]">
              watch the model think.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg"
          >
            A simplified, in-browser version of ClaimSense 360&apos;s risk
            engine — every score comes with the factors behind it, the same
            way the production model explains itself with SHAP.
          </motion.p>
        </div>

        {/* PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_1fr] lg:p-10"
        >
          {/* CONTROLS */}
          <div className="flex flex-col gap-7">
            <Slider
              label="Claim amount"
              value={claimAmount}
              min={10000}
              max={500000}
              step={5000}
              format={formatINR}
              onChange={setClaimAmount}
            />

            <Slider
              label="Vehicle age"
              value={vehicleAge}
              min={0}
              max={20}
              step={1}
              format={(n) => `${n} ${n === 1 ? "year" : "years"}`}
              onChange={setVehicleAge}
            />

            <Slider
              label="Prior claims (past 3 yrs)"
              value={priorClaims}
              min={0}
              max={5}
              step={1}
              format={(n) => `${n}`}
              onChange={setPriorClaims}
            />

            <div className="grid grid-cols-2 gap-4">
              <Toggle
                label="Police report filed"
                checked={policeReport}
                onChange={setPoliceReport}
              />
              <Toggle
                label="Witness present"
                checked={witnessPresent}
                onChange={setWitnessPresent}
              />
            </div>
          </div>

          {/* RESULT */}
          <div className="flex flex-col justify-between gap-6 rounded-[24px] border border-white/10 bg-[#0B1120] p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Fraud risk score
                </p>
                <div className="mt-3 flex items-end gap-2">
                  <motion.span
                    key={score}
                    initial={{ opacity: 0.4, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="font-serif text-6xl font-bold tabular-nums"
                    style={{ color: band.color }}
                  >
                    {score}
                  </motion.span>
                  <span className="mb-2 text-sm text-white/40">/ 100</span>
                </div>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: `${band.color}1A`, color: band.color }}
              >
                <band.Icon size={22} />
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: band.color }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>

            <div>
              <p
                className="text-sm font-bold uppercase tracking-[0.1em]"
                style={{ color: band.color }}
              >
                {band.name}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {band.action}
              </p>
            </div>

            {/* EXPLAINABILITY BREAKDOWN */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                <Activity size={12} />
                Why the model says this
              </p>

              <div className="flex flex-col gap-2.5">
                {factors.map((f) => {
                  const positive = f.contribution >= 0;
                  const width = Math.max(
                    6,
                    (Math.abs(f.contribution) / maxAbsContribution) * 100
                  );
                  return (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-xs text-white/60">
                        {f.label}
                      </span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: positive ? "#f28b6d" : "#59d98a",
                          }}
                          animate={{ width: `${width}%` }}
                          transition={{
                            duration: 0.35,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                        />
                      </div>
                      <span
                        className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums"
                        style={{ color: positive ? "#f28b6d" : "#59d98a" }}
                      >
                        {positive ? "+" : ""}
                        {f.contribution}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-white/40">
              <FileWarning size={14} className="mt-0.5 shrink-0" />
              Illustrative scoring for demonstration — the production
              platform runs a trained XGBoost model with SHAP explanations
              behind this same interface.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-semibold text-white/80">
          {label}
        </label>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tabular-nums text-[#C9FF3D]">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        className="cs-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors duration-200 hover:border-white/20"
    >
      <span className="text-sm font-semibold text-white/80">{label}</span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
        style={{ background: checked ? "#C9FF3D" : "rgba(255,255,255,0.15)" }}
      >
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-[#0B1120]"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        />
      </span>
    </button>
  );
}
