"use client";



import { useState } from "react";


import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Sparkles,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import RiskResultPanel, { ClaimAnalysisResultData } from "@/components/shared/risk-result-panel";
import PageTransition from "@/components/shared/page-transition";
import { analyzeClaim } from "@/lib/api";


export default function NewClaimPage() {
  // Form State
  const [customerName, setCustomerName] = useState("Nihar Sahu");
  const [vehicleMakeModel, setVehicleMakeModel] = useState("Hyundai Creta 1.5 SX (2021)");
  const [age, setAge] = useState(28);
  const [vehiclePrice, setVehiclePrice] = useState(1400000);
  const [claimAmount, setClaimAmount] = useState(95000);
  const [vehicleAge, setVehicleAge] = useState(3);
  const [pastClaims, setPastClaims] = useState(0);
  const [driverRating, setDriverRating] = useState(5);
  const [policyType, setPolicyType] = useState<"Third-Party" | "Comprehensive" | "Zero-Dep">("Comprehensive");
  const [fault, setFault] = useState<"Policy Holder" | "Third Party">("Third Party");
  const [accidentArea, setAccidentArea] = useState<"Urban" | "Rural" | "Highway">("Urban");
  const [incidentSeverity, setIncidentSeverity] = useState<
    "Trivial Damage" | "Minor Damage" | "Major Damage" | "Total Loss"
  >("Minor Damage");
  const [policeReportFiled, setPoliceReportFiled] = useState(true);
  const [witnessPresent, setWitnessPresent] = useState(true);
  const [incidentDescription, setIncidentDescription] = useState(
    "Driving on city main road near intersection when another vehicle swerved without signaling. Heavy front left bumper crushing, grill detachment, and headlight assembly damage reported. Police report filed."
  );


  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // Analysis State
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ClaimAnalysisResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setBase64Image(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const claimInput = {
      customer_name: customerName,
      vehicle_make_model: vehicleMakeModel,
      age: Number(age),
      vehicle_price: Number(vehiclePrice),
      claim_amount: Number(claimAmount),
      vehicle_age: Number(vehicleAge),
      past_claims: Number(pastClaims),
      driver_rating: Number(driverRating),
      policy_type: policyType,
      fault: fault,
      accident_area: accidentArea,
      incident_severity: incidentSeverity,
      police_report_filed: policeReportFiled,
      witness_present: witnessPresent,
      incident_description: incidentDescription,
    };

    try {
      const res = await analyzeClaim(claimInput, imageFile);
      const exactUploadedPhoto = base64Image || imagePreview || res.image_data || res.image_path;
      if (exactUploadedPhoto) {
        res.image_data = exactUploadedPhoto;

        const { registerSubmittedClaim } = await import("@/lib/submitted-claims");

        registerSubmittedClaim({
          id: res.claim_id,
          claim_id: res.claim_id,
          customer_name: customerName,
          vehicle_make_model: vehicleMakeModel,
          age: Number(age),
          vehicle_price: Number(vehiclePrice),
          claim_amount: Number(claimAmount),
          vehicle_age: Number(vehicleAge),
          past_claims: Number(pastClaims),
          driver_rating: Number(driverRating),
          policy_type: policyType,
          fault: fault,
          accident_area: accidentArea,
          police_report_filed: policeReportFiled,
          witness_present: witnessPresent,
          incident_severity: incidentSeverity,
          incident_description: incidentDescription,
          overall_risk_score: res.overall_risk_score,
          risk_band: res.risk_band,
          recommended_action: res.recommended_action,
          damage_severity: res.damage?.damage_severity || incidentSeverity,
          damage_score: res.damage?.damage_score || 50.0,
          image_data: exactUploadedPhoto,
          image_path: exactUploadedPhoto,
          top_factors: res.top_factors,
          created_at: new Date().toISOString(),
        });
      }
      setAnalysisResult(res);
    } catch (err: any) {


      const msg = err?.message || "Failed to analyze claim.";
      if (msg.includes("401") || msg.includes("token") || msg.includes("authenticated")) {
        setError("Security session expired or not authenticated. Please click 'Logout' on the left menu, sign in again, and retry.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };


  return (

    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-x-hidden">
        <TopNavbar
          userName="Nihar Sahu"
          userRole="Admin"
          userEmail="niharrrsahu@gmail.com"
        />

        <PageTransition>
          <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/claims"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E66A4E] hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Claims List
              </Link>
              <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#173B32]">
                Submit New Claim for AI Analysis
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#173B32]/70 font-medium">
                Run XGBoost fraud predictions, SHAP explainability, NLP suspicion detection &amp; damage CV
              </p>
            </div>
          </div>

          {/* Form & Live Result 2-Column Grid */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
            {/* Left Column: Input Form (7 cols) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 space-y-6 rounded-3xl border border-[#173B32]/12 bg-white p-4 sm:p-6 lg:p-8 shadow-sm"
            >

              <h3 className="text-xl font-serif font-bold text-[#173B32] border-b border-[#173B32]/10 pb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#173B32]" /> Claim Intake Details
              </h3>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-[#FDF0ED] p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Customer & Vehicle Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Vehicle Make &amp; Model
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleMakeModel}
                    onChange={(e) => setVehicleMakeModel(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>
              </div>

              {/* Amounts & Ages */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Claim Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={20000000}
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Vehicle Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={10000}
                    max={20000000}
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Driver Age
                  </label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>
              </div>

              {/* History & Policy Controls */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Vehicle Age (Yrs)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={40}
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Past Claims Count
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={20}
                    value={pastClaims}
                    onChange={(e) => setPastClaims(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Driver Rating (1-5)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={5}
                    value={driverRating}
                    onChange={(e) => setDriverRating(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  />
                </div>
              </div>

              {/* Selects */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Incident Severity
                  </label>
                  <select
                    value={incidentSeverity}
                    onChange={(e: any) => setIncidentSeverity(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  >
                    <option value="Trivial Damage">Trivial Damage</option>
                    <option value="Minor Damage">Minor Damage</option>
                    <option value="Major Damage">Major Damage</option>
                    <option value="Total Loss">Total Loss</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Policy Type
                  </label>
                  <select
                    value={policyType}
                    onChange={(e: any) => setPolicyType(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  >
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Third-Party">Third-Party</option>
                    <option value="Zero-Dep">Zero-Dep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Fault Allocation
                  </label>
                  <select
                    value={fault}
                    onChange={(e: any) => setFault(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  >
                    <option value="Policy Holder">Policy Holder</option>
                    <option value="Third Party">Third Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                    Accident Area
                  </label>
                  <select
                    value={accidentArea}
                    onChange={(e: any) => setAccidentArea(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                  >
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                    <option value="Highway">Highway</option>
                  </select>
                </div>
              </div>

              {/* Switches */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <label className="flex items-center justify-between rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-4 cursor-pointer">
                  <span className="text-sm font-semibold text-[#173B32]">Police Report Filed?</span>
                  <input
                    type="checkbox"
                    checked={policeReportFiled}
                    onChange={(e) => setPoliceReportFiled(e.target.checked)}
                    className="h-5 w-5 rounded border-[#173B32]/30 text-[#173B32] focus:ring-[#173B32]"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-4 cursor-pointer">
                  <span className="text-sm font-semibold text-[#173B32]">Witness Present?</span>
                  <input
                    type="checkbox"
                    checked={witnessPresent}
                    onChange={(e) => setWitnessPresent(e.target.checked)}
                    className="h-5 w-5 rounded border-[#173B32]/30 text-[#173B32] focus:ring-[#173B32]"
                  />
                </label>
              </div>

              {/* Incident Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-[#173B32]/70">
                  Incident Description (Analyzed by NLP Deception Model)
                </label>
                <textarea
                  rows={3}
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  placeholder="Describe what happened during the incident..."
                  className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-4 text-sm text-[#101412] outline-none focus:border-[#173B32]"
                />
              </div>

              {/* Photo Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold uppercase text-[#173B32]/70 mb-2">
                  Damage Photo (Analyzed by Computer Vision Engine)
                </label>

                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] p-2 flex items-center justify-between">
                    {/* eslint-disable-next-next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Damage preview"
                      className="h-24 w-32 object-cover rounded-xl"
                    />
                    <div className="flex-1 px-4">
                      <p className="text-xs font-bold text-[#101412]">{imageFile?.name}</p>
                      <p className="text-xs text-[#173B32]/70">
                        {((imageFile?.size || 0) / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-full bg-[#FDF0ED] p-2 text-[#E66A4E] hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#173B32]/25 bg-[#F4F1EA] p-6 text-center cursor-pointer transition hover:border-[#173B32]">
                    <Upload className="h-8 w-8 text-[#173B32] mb-2" />
                    <span className="text-xs font-bold text-[#173B32]">
                      Drop vehicle damage photo or click to browse
                    </span>
                    <span className="text-[11px] text-[#173B32]/70 mt-1 font-medium">
                      Supports JPG, PNG, WEBP (Analyzed via heuristic CV)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] py-4 font-bold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Running AI Fraud Models &amp; Computing SHAP...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Analyze &amp; Process Claim
                  </>
                )}
              </button>
            </form>

            {/* Right Column: Live Result Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#173B32]/12 bg-white p-12 text-center shadow-sm h-full min-h-[400px]">
                  <Loader2 className="h-12 w-12 text-[#173B32] animate-spin mb-4" />
                  <h4 className="text-lg font-serif font-bold text-[#173B32]">
                    Processing Claim &amp; AI Models
                  </h4>
                  <p className="mt-2 text-xs text-[#173B32]/70 font-medium max-w-xs">
                    Executing XGBoost risk scoring, SHAP TreeExplainer factors, NLP suspicion checks and damage CV analysis...
                  </p>
                </div>
              ) : analysisResult ? (
                <RiskResultPanel result={analysisResult} />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[#173B32]/12 bg-white p-12 text-center shadow-sm min-h-[400px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173B32]/10 text-[#173B32] mb-4">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#173B32]">
                    Live Risk Analysis Result
                  </h4>
                  <p className="mt-2 text-xs text-[#173B32]/70 font-medium max-w-xs">
                    Fill in the claim form on the left and click &quot;Analyze &amp; Process Claim&quot; to see real-time fraud probability, SHAP factors, and risk classification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        </PageTransition>
      </div>
    </main>
  );
}

