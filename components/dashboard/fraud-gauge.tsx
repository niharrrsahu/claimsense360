"use client";

import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface FraudGaugeProps {
  score?: number;
  totalClaims?: number;
}

export default function FraudGauge({ score = 0, totalClaims = 0 }: FraudGaugeProps) {
  let color = "text-[#173B32] border-[#173B32]";
  let label = "Low Risk";
  let Icon = ShieldCheck;

  if (score >= 70) {
    color = "text-[#E66A4E] border-[#E66A4E]";
    label = "High Risk Alert";
    Icon = ShieldAlert;
  } else if (score >= 30) {
    color = "text-[#D99A24] border-[#D99A24]";
    label = "Moderate Risk";
    Icon = AlertTriangle;
  }

  return (
    <div className="rounded-3xl border border-[#173B32]/12 bg-white p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-sans font-bold text-[#173B32]">Average Fraud Risk Score</h3>
            <p className="text-xs text-[#173B32]/70 font-medium">Aggregated DB Score</p>
          </div>

          <Icon className={color.split(" ")[0]} size={26} />
        </div>

        <div className="mt-8 flex justify-center">
          <div className={`flex h-44 w-44 flex-col items-center justify-center rounded-full border-[10px] p-2 text-center ${color.split(" ")[1]}`}>
            {totalClaims > 0 ? (
              <>
                <h1 className="text-4xl font-serif font-black text-[#173B32] leading-none">
                  {score}
                </h1>
                <p className={`mt-1.5 text-[11px] font-bold uppercase tracking-wider ${color.split(" ")[0]}`}>
                  {label}
                </p>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-[#173B32]/40 font-serif">0</span>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-tight text-[#173B32]/60 px-1">
                  No Claims Found
                </p>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="mt-6 border-t border-[#173B32]/10 pt-4">
        <div className="flex justify-between text-xs text-[#173B32]/70 font-medium">
          <span>Evaluated Claims Count:</span>
          <span className="font-bold text-[#173B32]">{totalClaims} Claims</span>
        </div>
      </div>
    </div>
  );
}