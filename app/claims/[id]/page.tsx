import Link from "next/link";




import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Car,
  ShieldCheck,
  Brain,
  Sparkles,
} from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import RiskResultPanel, { ClaimAnalysisResultData } from "@/components/shared/risk-result-panel";
import PageTransition from "@/components/shared/page-transition";
import { getSingleClaim, getDashboardData } from "@/lib/server-data";


export const dynamic = "force-dynamic";

export default async function SingleClaimPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const claimId = parseInt(resolvedParams.id, 10);

  if (isNaN(claimId)) {
    notFound();
  }

  const [claim, { currentUser }] = await Promise.all([
    getSingleClaim(claimId),
    getDashboardData(),
  ]);

  if (!claim) {
    notFound();
  }

  const isForensicFlagged = (claim.top_factors || []).some(
    (f: { feature?: string; name?: string }) => f.feature === "image_forensics" || f.name?.toLowerCase().includes("exif")
  );


  const analysisResultData: ClaimAnalysisResultData = {
    claim_id: claim.id,
    fraud_probability: claim.fraud_probability || 0,
    fraud_score: claim.overall_risk_score || 0,
    overall_risk_score: claim.overall_risk_score || 0,
    risk_band: claim.risk_band || "Low risk",
    recommended_action: claim.recommended_action || "Proceed to approval",
    top_factors: claim.top_factors || [],
    image_data: claim.image_data || null,
    damage: claim.damage_score != null || claim.image_data != null
      ? {
          damage_score: claim.damage_score || 40.0,
          damage_severity: claim.damage_severity || "Low",
          method: "Ultralytics YOLOv8 + PyTorch ResNet-18",
          has_exif: !isForensicFlagged,
          is_web_asset: isForensicFlagged,
        }
      : null,

    narrative: claim.narrative_suspicion_score != null
      ? {
          suspicion_score: claim.narrative_suspicion_score,
          label: claim.narrative_label || "Normal",
          flagged_phrases: claim.flagged_phrases || [],
        }
      : null,
  };


  return (

    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-x-hidden">
        <TopNavbar
          userName={currentUser?.full_name || "Nihar Sahu"}
          userRole={currentUser?.role || "Admin"}
          userEmail={currentUser?.email || "niharrrsahu@gmail.com"}
        />

        <PageTransition>
          <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/claims"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E66A4E] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Claims Directory
              </Link>
              <div className="mt-2 flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-[#173B32]">
                  Claim CLM-{String(claim.id).padStart(5, "0")}
                </h1>
                <span className="rounded-full bg-[#173B32] px-3.5 py-1 text-xs font-bold text-[#C9FF3D]">
                  {claim.risk_band}
                </span>
              </div>
            </div>

            <Link
              href={`/copilot?copilot_claim=${claim.id}`}
              className="flex items-center gap-2 rounded-2xl bg-[#173B32] hover:bg-[#23584b] px-5 py-3 text-xs font-bold text-[#C9FF3D] shadow-md transition active:scale-95"
            >
              <Brain className="h-4 w-4 text-[#C9FF3D]" /> Ask Copilot About Claim #{claim.id}
            </Link>

          </div>

          {/* Grid Layout: Claim Overview + AI Risk Panel */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left 6 cols: Claim Data Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              {/* Customer & Policy Summary */}
              <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-serif font-bold text-[#173B32] border-b border-[#173B32]/10 pb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#173B32]" /> Policy Holder &amp; Vehicle Info
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#173B32]/70 font-medium">Customer Name:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">
                      {claim.customer_name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Driver Age:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">{claim.age} Years</p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Vehicle Model:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">
                      {claim.vehicle_make_model || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Policy Type:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">{claim.policy_type}</p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Claim Amount:</span>
                    <p className="text-base font-serif font-bold text-[#173B32] mt-0.5">
                      ₹{claim.claim_amount?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Vehicle Value:</span>
                    <p className="text-base font-serif font-bold text-[#101412] mt-0.5">
                      ₹{claim.vehicle_price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accident Circumstances */}
              <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-serif font-bold text-[#173B32] border-b border-[#173B32]/10 pb-3 flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#173B32]" /> Incident &amp; Fault Details
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#173B32]/70 font-medium">Fault Allocation:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">{claim.fault}</p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Accident Area:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">{claim.accident_area}</p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Police Report:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">
                      {claim.police_report_filed ? "Filed" : "Not Filed"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#173B32]/70 font-medium">Witness Present:</span>
                    <p className="text-sm font-bold text-[#101412] mt-0.5">
                      {claim.witness_present ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#173B32]/10 pt-3">
                  <span className="text-xs text-[#173B32]/70 font-medium">Submitted Incident Description:</span>
                  <p className="mt-1 rounded-2xl bg-[#F4F1EA] p-4 text-xs font-medium text-[#101412] leading-relaxed">
                    &quot;{claim.incident_description}&quot;
                  </p>
                </div>
              </div>

              {/* Uploaded Damage Photo Evidence Card */}
              {(claim.image_data || claim.image_path) && (
                <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-serif font-bold text-[#173B32]">
                      Uploaded Damage Evidence Photo
                    </span>
                    <span className="rounded-full bg-[#173B32]/10 px-3 py-1 text-xs font-bold text-[#173B32]">
                      AI Inspected Asset
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#173B32]/15 shadow-sm max-h-64">
                    <img
                      src={claim.image_data || claim.image_path}
                      alt="Uploaded Damage Photo Evidence"
                      className="w-full object-cover max-h-64 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}

            </div>


            {/* Right 6 cols: Full AI Explainability & Risk Panel */}
            <div className="lg:col-span-6 space-y-6">
            </div>
          </div>
        </div>
        </PageTransition>
      </div>
    </main>
  );
}

