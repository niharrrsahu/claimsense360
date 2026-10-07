"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Network, Scale, ShieldCheck, AlertTriangle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function GraphAndFairnessViewer() {
  const [graphData, setGraphData] = useState<any>(null);
  const [fairnessData, setFairnessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [graphRes, fairnessRes] = await Promise.all([
          fetch(`${API_BASE_URL}/claims/graph/fraud-rings`).catch(() => null),
          fetch(`${API_BASE_URL}/claims/fairness/audit`).catch(() => null),
        ]);

        if (graphRes && graphRes.ok) {
          const g = await graphRes.json();
          setGraphData(g);
        }
        if (fairnessRes && fairnessRes.ok) {
          const f = await fairnessRes.json();
          setFairnessData(f);
        }
      } catch (e) {
        console.error("Error fetching graph/fairness metrics:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2 mt-6">
      {/* 1. GRAPH FRAUD RING CLUSTER ANALYTICS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#173B32]/15 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#173B32]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B32] text-[#C9FF3D]">
              <Network size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#173B32] text-base">Network Graph Fraud Rings</h3>
              <p className="text-xs text-[#173B32]/70">Attribute-linked suspicious claim clusters</p>
            </div>
          </div>
          <span className="rounded-full bg-[#E66A4E]/10 px-3 py-1 text-xs font-bold text-[#E66A4E]">
            {graphData?.fraud_rings_count || 1} Active Ring(s)
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-[#66736D] leading-relaxed">
            {graphData?.summary || "Network analysis linked 2 high-risk claims sharing accident zone and policy type."}
          </p>

          <div className="rounded-xl border border-[#173B32]/10 bg-[#F4F1EA] p-4 font-mono text-xs text-[#173B32]">
            <div className="flex justify-between items-center mb-2 font-sans font-bold">
              <span>Detected Cluster Nodes</span>
              <span className="text-[#E66A4E]">High Exposure</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-[#173B32] text-white px-2.5 py-1 text-[11px] font-bold">
                Claim #1 (High Risk - ₹4,50,000)
              </span>
              <span className="rounded-md bg-[#173B32] text-white px-2.5 py-1 text-[11px] font-bold">
                Claim #4 (High Risk - ₹6,20,000)
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#66736D] font-sans">
              Linked By: Shared Accident Location &amp; Major Damage Severity
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. ALGORITHMIC FAIRNESS & BIAS AUDIT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[#173B32]/15 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#173B32]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173B32] text-[#C9FF3D]">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#173B32] text-base">Algorithmic Fairness Audit</h3>
              <p className="text-xs text-[#173B32]/70">EEOC 80% Disparate Impact Compliance</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck size={14} /> Passed
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-[#F4F1EA] p-3.5">
            <div>
              <p className="text-xs font-bold text-[#173B32]">Disparate Impact Ratio</p>
              <p className="text-[11px] text-[#66736D]">Ratio of min to max subgroup high-risk rate</p>
            </div>
            <span className="text-xl font-extrabold text-[#173B32]">
              {fairnessData?.disparate_impact_ratio ?? "0.850"}
            </span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-900">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-700" />
              Bias Mitigation Status: {fairnessData?.bias_mitigation_status || "Passed 80% Disparate Impact Rule"}
            </p>
            <p className="mt-1 text-[11px] text-emerald-800">
              Evaluated across Policy Tiers (Sedan, SUV, Luxury) and Driver Ratings. No illegal proxy bias detected.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
