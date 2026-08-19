import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import FraudClaimsList from "@/components/fraud/fraud-claims-list";
import { getHighRiskClaims, getDashboardData } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function FraudPage() {
  const [highRiskClaims, { currentUser }] = await Promise.all([
    getHighRiskClaims(),
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


        <div className="flex-1 space-y-8 p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#173B32]">
                SIU Priority Fraud Audit Queue
              </h1>
              <p className="mt-1 text-sm text-[#173B32]/70 font-medium">
                Real-time queue of high-risk claims flagged for Special Investigation Unit review
              </p>
            </div>

            <span className="rounded-full bg-[#FDF0ED] border border-[#E66A4E]/30 px-4 py-1.5 text-xs font-bold text-[#E66A4E]">
              {highRiskClaims.length} High Risk Flagged
            </span>
          </div>

          {/* List Card */}
          <div className="rounded-3xl border border-[#173B32]/12 bg-white p-8 shadow-sm">
            <FraudClaimsList highRiskClaims={highRiskClaims} />
          </div>
        </div>
      </div>
    </main>
  );
}
