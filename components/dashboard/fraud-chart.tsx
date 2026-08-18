"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ShieldAlert } from "lucide-react";

interface FraudChartProps {
  lowCount?: number;
  mediumCount?: number;
  highCount?: number;
}

export default function FraudChart({
  lowCount = 0,
  mediumCount = 0,
  highCount = 0,
}: FraudChartProps) {
  const data = [
    { name: "Low Risk", count: lowCount, color: "#10b981" },      // Emerald
    { name: "Medium Risk", count: mediumCount, color: "#f59e0b" },  // Amber
    { name: "High Risk", count: highCount, color: "#ef4444" },     // Red
  ];

  const total = lowCount + mediumCount + highCount;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Risk Distribution</h2>
          <p className="mt-1 text-xs text-gray-400">
            Categorized breakdown of claims by AI risk severity
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      {total === 0 ? (
        <div className="mt-8 flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#08111F]/50 p-6 text-center text-xs text-gray-400">
          No claims recorded yet to display risk distribution.
        </div>
      ) : (
        <div className="mt-6 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B1120",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
