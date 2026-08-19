import Link from "next/link";

import { PlusCircle, Search, FileText, ArrowRight } from "lucide-react";

import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import ClaimsTableClient from "@/components/claims/claims-table-client";
import { getClaimsList, getDashboardData } from "@/lib/server-data";
import { API_BASE_URL } from "@/lib/config";


export const dynamic = "force-dynamic";

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || "";

  const [claims, { currentUser }] = await Promise.all([
    getClaimsList(""),
    getDashboardData(),
  ]);

  return (
    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-x-hidden">
        <TopNavbar
          userName={currentUser?.full_name || "Nihar Sahu"}
          userRole={currentUser?.role || "Admin"}
          userEmail={currentUser?.email || "niharrrsahu@gmail.com"}
        />

        <div className="flex-1 space-y-6 px-4 sm:px-6 lg:px-8 py-5 w-full max-w-full overflow-x-hidden">



          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-sans font-bold tracking-tight text-[#173B32]">
                Claims Directory &amp; Database Portal
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#173B32]/70 font-medium">
                Complete repository of all processed vehicle insurance claims with real-time search &amp; risk filtering
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`${API_BASE_URL}/claims/history?limit=100`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-[#173B32]/20 bg-white hover:bg-[#F4F1EA] px-4 py-2.5 text-xs font-bold text-[#173B32] shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>📥 Export JSON/CSV</span>
              </a>
            </div>
          </div>

          {/* Interactive Client Claims Table with Instant Search */}
          <ClaimsTableClient initialClaims={claims} initialQuery={searchQuery} />

        </div>
      </div>
    </main>
  );
}