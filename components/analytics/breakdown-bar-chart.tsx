"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ItemData {
  label: string;
  count: number;
}

interface BreakdownBarChartProps {
  data?: ItemData[];
  emptyText?: string;
  colors?: string[];
}

export default function BreakdownBarChart({
  data = [],
  emptyText = "No data recorded.",
  colors = ["#173B32", "#E66A4E", "#D99A24", "#3D9B62", "#8B5CF6"],
}: BreakdownBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-4 text-center text-xs text-[#173B32]/70 font-medium">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 20 }}>
          <XAxis dataKey="label" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} dy={5} />

          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(23, 59, 50, 0.05)", rx: 8 }}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(23,59,50,0.15)",
              borderRadius: "16px",
              color: "#101412",
              fontSize: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          />

          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
