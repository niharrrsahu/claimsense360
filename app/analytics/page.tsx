import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import AnalyticsFilterExplorer from "@/components/analytics/analytics-filter-explorer";
import InteractiveValueShowcase from "@/components/analytics/interactive-value-showcase";
import { getClaimsList, getDashboardData } from "@/lib/server-data";


export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [claims, { currentUser }] = await Promise.all([
    getClaimsList(),
    getDashboardData(),
  ]);

  return (
    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar
          userName={currentUser?.full_name || "Nihar Sahu"}
          userRole={currentUser?.role || "Admin"}
          userEmail={currentUser?.email || "niharrrsahu@gmail.com"}
        />


        <div className="flex-1 space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-sans font-bold tracking-tight text-[#173B32]">
              Claims Intelligence Analytics &amp; Risk Explorer
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#173B32]/70 font-medium">
              Interactive multi-filter risk analysis across risk bands, policy tiers, fault allocations, and accident zones
            </p>
          </div>

          {/* Interactive Multi-Filter & Deep Analytics Explorer */}
          <AnalyticsFilterExplorer initialClaims={claims} />

          {/* Interactive Visual Enterprise Value Showcase */}
          <InteractiveValueShowcase />


        </div>
      </div>
    </main>
  );
}
