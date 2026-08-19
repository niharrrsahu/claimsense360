"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface MonthData {
  month: string;
  claims: number;
}

interface AnalyticsChartProps {
  data?: MonthData[];
}

export default function AnalyticsChart({ data = [] }: AnalyticsChartProps) {
  return (
    <div className="rounded-3xl border border-[#173B32]/12 bg-white p-4 sm:p-6 lg:p-8 shadow-sm max-w-full overflow-hidden">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-sans font-bold text-[#173B32]">Monthly Claims Trend</h3>
          <p className="text-[11px] sm:text-xs text-[#173B32]/70 font-medium">Total claims processed per month</p>
        </div>

        <span className="rounded-full bg-[#173B32]/10 px-2.5 sm:px-3.5 py-1 text-[10px] sm:text-xs font-bold text-[#173B32] shrink-0">
          Live Database Feed
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-56 sm:h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center text-xs text-[#173B32]/70 font-medium">
          No monthly claims data available in database yet.
        </div>
      ) : (
        <div className="h-56 sm:h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173B32" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#173B32" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#e5e7eb" vertical={false} />

              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "rgba(23,59,50,0.15)",
                  borderRadius: "16px",
                  color: "#101412",
                  fontSize: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              />

              <Area
                type="monotone"
                dataKey="claims"
                stroke="#173B32"
                strokeWidth={3}
                fill="url(#claimsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}