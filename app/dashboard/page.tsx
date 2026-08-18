import Link from "next/link";

import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import StatCard from "@/components/dashboard/stat-card";
import RecentClaims from "@/components/dashboard/recent-claims";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import FraudGauge from "@/components/dashboard/fraud-gauge";
import DamageCard from "@/components/dashboard/damage-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import LiveRiskSimulator from "@/components/dashboard/live-risk-simulator";
import { getDashboardData } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { summary, recentClaims, monthlyTrend, latestDamage, activityFeed, currentUser } =
    await getDashboardData();

  return (
    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar
          userName={currentUser?.full_name || "System Admin"}
          userRole={currentUser?.role || "Admin"}
        />

        <div className="flex-1 space-y-6 p-4 sm:p-6">
          {/* Header Banner & Quick Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-sans font-bold tracking-tight text-[#173B32]">
                AI Insurance Intelligence Command Center
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#173B32]/70 font-medium">
                Real-time monitoring of vehicle claims, fraud detection metrics, and explainable AI insights.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="/claims/new"
                className="flex items-center gap-1.5 rounded-2xl bg-[#173B32] hover:bg-[#23584b] px-4 py-2.5 text-xs font-bold text-[#C9FF3D] shadow-sm transition active:scale-95"
              >
                <span className="text-[#C9FF3D] font-bold">➕ Submit Claim</span>
              </a>

              <a
                href="/fraud"
                className="flex items-center gap-1.5 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
              >
                <span className="text-white font-bold">🛡️ SIU Queue ({summary.high_risk_count})</span>
              </a>


              <a
                href="/copilot"
                className="flex items-center gap-1.5 rounded-2xl border border-[#173B32]/20 bg-white hover:bg-[#F4F1EA] px-4 py-2.5 text-xs font-bold text-[#173B32] shadow-xs transition active:scale-95"
              >
                <span className="text-[#173B32] font-bold">🤖 AI Copilot</span>
              </a>
            </div>
          </div>

          {/* Live Interactive AI Sandbox Risk Simulator */}
          <LiveRiskSimulator />


          {/* Top 4 Stat Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Claims"
              value={summary.total_claims.toLocaleString("en-IN")}
            />
            <StatCard
              title="High Risk Count"
              value={summary.high_risk_count.toString()}
            />
            <StatCard
              title="Avg Risk Score"
              value={summary.avg_risk_score.toString()}
            />
            <StatCard
              title="Avg Claim Amount"
              value={`₹${Math.round(summary.avg_claim_amount).toLocaleString("en-IN")}`}
            />
          </div>

          {/* Row 2: Analytics Chart + Fraud Gauge */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AnalyticsChart data={monthlyTrend} />
            </div>
            <div className="lg:col-span-1">
              <FraudGauge
                score={summary.avg_risk_score}
                totalClaims={summary.total_claims}
              />
            </div>
          </div>

          {/* Row 3: Recent Claims Table */}
          <RecentClaims claims={recentClaims} />

          {/* Row 4: Live Computer Vision Damage Inspector & Automated AI System Feed */}
          <div className="grid gap-8 lg:grid-cols-2">
            <DamageCard latestDamage={latestDamage} />
            <ActivityFeed activities={activityFeed} />
          </div>
        </div>
      </div>
    </main>
  );
}