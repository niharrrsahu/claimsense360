"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, Send, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { askCopilot } from "@/lib/api";

function CopilotContent() {
  const searchParams = useSearchParams();
  const copilotClaimIdParam = searchParams.get("copilot_claim");

  const [question, setQuestion] = useState("");
  const [claimId, setClaimId] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (copilotClaimIdParam) {
      const parsed = parseInt(copilotClaimIdParam, 10);
      if (!isNaN(parsed)) {
        setClaimId(parsed);
        setQuestion(`Explain why claim #${parsed} was scored with its current risk assessment.`);
      }
    }
  }, [copilotClaimIdParam]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setError(null);
    setAnswer(null);
    setLoading(true);

    try {
      const res = await askCopilot(question, claimId);
      setAnswer(res.answer);
    } catch (err: any) {
      const msg = err?.message || "Failed to query AI Copilot.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="copilot" className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm flex flex-col justify-between">

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B32]/10 text-[#173B32]">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-[#173B32]">AI Copilot</h3>
              <p className="text-xs text-[#173B32]/70 font-medium">

                {claimId ? `Scoped to Claim #${claimId}` : "Ask anything about recent claims"}
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1 rounded-full bg-[#173B32] px-3 py-1 text-xs font-semibold text-[#C9FF3D]">
            <Sparkles className="h-3 w-3" /> Claude 3.5 Sonnet
          </span>
        </div>

        {/* Answer Container */}
        {error ? (
          <div className="mt-6 rounded-2xl border border-amber-500/20 bg-[#FFF8E6] p-4 text-xs text-[#D99A24] flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#D99A24] mt-0.5" />
            <div>
              <span className="font-bold block">Copilot Notice:</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        ) : answer ? (
          <div className="mt-6 rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-5 text-sm text-[#101412] leading-relaxed max-h-60 overflow-y-auto">
            <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider block mb-2">
              Copilot Insight:
            </span>
            {answer}
          </div>
        ) : (
          <p className="mt-4 text-xs text-[#173B32]/70 font-medium">
            Query Claude 3.5 Sonnet directly for claim synthesis, anomaly explanations, and risk auditing.
          </p>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-6">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Which claim submitted today has the highest financial risk?"
          className="w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-4 text-sm text-[#101412] placeholder-gray-500 outline-none focus:border-[#173B32]"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] py-3.5 font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Ask Copilot
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function CopilotPanel() {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-[#173B32]/12 bg-white p-8 text-xs text-[#173B32]/70 font-medium">Loading Copilot...</div>}>
      <CopilotContent />
    </Suspense>
  );
}
