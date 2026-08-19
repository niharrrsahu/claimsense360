"use client";



import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Camera,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export interface FraudFactorData {
  feature: string;
  name: string;
  contribution: number;
  effect: string;
}

export interface DamageData {
  damage_score: number;
  damage_severity: string;
  method: string;
  details?: any;
  has_exif?: boolean;
  is_web_asset?: boolean;
}


export interface FlaggedPhraseData {
  phrase: string;
  impact: number;
  effect: string;
}

export interface NarrativeData {
  suspicion_score: number;
  label: string;
  flagged_phrases: FlaggedPhraseData[];
}

export interface ClaimAnalysisResultData {
  claim_id?: number | null;
  fraud_probability: number;
  fraud_score: number;
  overall_risk_score: number;
  risk_band: string;
  recommended_action: string;
  top_factors: FraudFactorData[];
  damage?: DamageData | null;
  narrative?: NarrativeData | null;
  image_data?: string | null;
}


export default function RiskResultPanel({
  result,
  savedClaimId,
}: {
  result: ClaimAnalysisResultData;
  savedClaimId?: number | null;
}) {
  const score = result.overall_risk_score;

  let scoreColor = "text-[#173B32]";
  let bgGradient = "bg-[#173B32]/5";
  let borderColor = "border-[#173B32]/20";
  let barColor = "bg-[#173B32]";
  let Icon = ShieldCheck;

  if (score >= 70) {
    scoreColor = "text-[#E66A4E]";
    bgGradient = "bg-[#FDF0ED]";
    borderColor = "border-[#E66A4E]/30";
    barColor = "bg-[#E66A4E]";
    Icon = ShieldAlert;
  } else if (score >= 30) {
    scoreColor = "text-[#D99A24]";
    bgGradient = "bg-[#FFF8E6]";
    borderColor = "border-[#D99A24]/30";
    barColor = "bg-[#D99A24]";
    Icon = AlertTriangle;
  }

  const claimIdToDisplay = result.claim_id || savedClaimId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      {/* Main Score Banner */}
      <div className={`relative overflow-hidden rounded-3xl border ${borderColor} ${bgGradient} p-6 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Icon className={`h-6 w-6 ${scoreColor}`} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#173B32]/70">
                Overall Risk Assessment
              </span>
              <h3 className="text-lg font-serif font-bold text-[#101412]">{result.risk_band}</h3>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-4xl font-serif font-extrabold ${scoreColor}`}>
              {score}
            </span>
            <span className="text-sm font-semibold text-[#173B32]/60"> / 100</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white border border-[#173B32]/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(score, 100)}%` }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className={`h-full ${barColor} rounded-full`}
          />
        </div>

        {/* Recommended Action */}
        <div className="mt-4 flex items-center justify-between border-t border-[#173B32]/10 pt-4 text-sm">
          <span className="text-[#173B32]/70 font-medium">Recommended Action:</span>
          <span className="font-bold text-[#101412]">{result.recommended_action}</span>
        </div>

        {claimIdToDisplay && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#173B32] border border-[#173B32]/10 shadow-xs">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#173B32]" />
              Saved to Database as Claim #{String(claimIdToDisplay).padStart(5, "0")}
            </span>
            <Link
              href={`/claims/${claimIdToDisplay}`}
              className="flex items-center gap-1 font-bold text-[#E66A4E] hover:underline"
            >
              View Full Detail <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {/* SHAP Factor Explainability */}
      {result.top_factors && result.top_factors.length > 0 && (
        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#173B32]" />
            <h4 className="text-base font-serif font-bold text-[#173B32]">
              SHAP Explainability (Top Influencers)
            </h4>
          </div>
          <p className="mt-1 text-xs text-[#173B32]/70 font-medium">
            Feature contributions generated by XGBoost TreeExplainer
          </p>

          <div className="mt-5 space-y-3">
            {result.top_factors.map((factor, idx) => {
              const isIncrease = factor.contribution > 0;
              const absVal = Math.min(Math.abs(factor.contribution) * 100, 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#101412]">{factor.name}</span>
                    <span className={isIncrease ? "text-[#E66A4E]" : "text-[#173B32]"}>
                      {isIncrease ? "+" : ""}
                      {factor.contribution.toFixed(3)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F1EA]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${absVal}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                      className={`h-full ${
                        isIncrease ? "bg-[#E66A4E]" : "bg-[#173B32]"
                      } rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NLP Narrative Suspicion Analysis */}
      {result.narrative && (
        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#173B32]" />
              <h4 className="text-base font-serif font-bold text-[#173B32]">
                NLP Incident Narrative Analysis
              </h4>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold border ${
                result.narrative.suspicion_score >= 50
                  ? "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/30"
                  : "bg-[#173B32]/10 text-[#173B32] border-[#173B32]/20"
              }`}
            >
              Suspicion Score: {result.narrative.suspicion_score}%
            </span>
          </div>

          {result.narrative.flagged_phrases &&
            result.narrative.flagged_phrases.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-[#173B32]/70">
                  Key Identified Phrases:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.narrative.flagged_phrases.map((item, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        item.effect === "increases_suspicion"
                          ? "bg-[#FDF0ED] text-[#E66A4E] border-[#E66A4E]/20"
                          : "bg-[#173B32]/10 text-[#173B32] border-[#173B32]/20"
                      }`}
                    >
                      &quot;{item.phrase}&quot; ({item.impact > 0 ? "+" : ""}
                      {item.impact})
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Damage Severity Analysis Card */}
      {result.damage && (
        <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#173B32]" />
              <h4 className="text-base font-serif font-bold text-[#173B32]">
                Vehicle Damage Image CV Score
              </h4>
            </div>
            <span className="rounded-full bg-[#173B32] px-3 py-1 text-xs font-bold text-[#C9FF3D]">
              Severity: {result.damage.damage_severity} ({result.damage.damage_score}/100)
            </span>
          </div>

          {(result.damage.has_exif === false || result.damage.is_web_asset) && (
            <div className="rounded-2xl border border-amber-500/30 bg-[#FFF8E6] p-4 text-xs font-semibold text-amber-900 flex items-start gap-2.5 shadow-xs">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wide text-amber-900 block mb-0.5">
                  ⚠️ Image Forensics Warning: Missing Camera EXIF Metadata
                </span>
                <span>
                  No smartphone camera telemetry found. Photo detected as web/Google Images download. Risk score elevated.
                </span>
              </div>
            </div>
          )}


          {(result.image_data || (result as any)?.image_path || (result.damage as any)?.image_data) && (
            <div className="overflow-hidden rounded-2xl border border-[#173B32]/15 shadow-sm max-h-48 my-3">
              <img
                src={result.image_data || (result as any)?.image_path || (result.damage as any)?.image_data}
                alt="Vehicle Damage Analysis"
                className="w-full object-cover h-48 hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}


          <div className="flex items-center justify-between text-xs text-[#173B32]/70 font-medium">
            <span>CV Method: {result.damage.method}</span>
            <span>Edge Density &amp; Contrast Irregularity</span>
          </div>
        </div>
      )}

    </motion.div>
  );
}
