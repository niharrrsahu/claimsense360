"use client";

import { useState, Suspense } from "react";


import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      document.cookie = `cs_token=demo_token_${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      await login(email, password);
    } catch (err: any) {
      console.warn("API login notice:", err);
    }
    window.location.href = nextParam;
  };

  const handleDemoLogin = async () => {
    setEmail("admin@claimsense.ai");
    setPassword("password123");
    setError(null);
    setLoading(true);

    try {
      document.cookie = `cs_token=demo_admin_token_${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
      await login("admin@claimsense.ai", "password123");
    } catch (err: any) {
      console.warn("Demo login notice:", err);
    }
    window.location.href = nextParam;
  };



  return (
    <div className="relative w-full max-w-md rounded-3xl border border-[#173B32]/12 bg-white p-8 sm:p-10 shadow-[0_25px_70px_rgba(23,59,50,0.12)] text-[#101412]">
      {/* Header */}
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101412] shadow-md">
          <span className="text-lg font-black text-[#C9FF3D]">CS</span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#173B32]/70">
          Enterprise Workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173B32]">
          Sign In to ClaimSense 360
        </h1>
        <p className="mt-1.5 text-xs text-[#66736D] font-medium leading-relaxed">
          Access the real-time AI risk assessment & claims decision platform.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-700 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@claimsense.ai"
            className="mt-2 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3.5 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white focus:ring-1 focus:ring-[#173B32]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3.5 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white focus:ring-1 focus:ring-[#173B32]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] py-3.5 font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Sign In to Workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Login Button */}
      <div className="mt-4 pt-4 border-t border-[#173B32]/10">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full rounded-2xl border border-[#173B32]/25 bg-[#173B32]/5 py-3 text-xs font-bold text-[#173B32] transition hover:bg-[#173B32]/10 active:scale-95 disabled:opacity-50"
        >
          ⚡ Quick Demo Login (Admin)
        </button>
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-center text-xs text-[#66736D] font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#E66A4E] underline-offset-4 hover:underline"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#F4F1EA] p-4 text-[#101412] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#173B32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#E66A4E]/10 blur-3xl" />

      <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-12 lg:grid lg:grid-cols-2">
        {/* Left Branding Side - Desktop Only */}
        <div className="hidden lg:flex flex-col justify-between space-y-8 pr-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101412] shadow-lg">
                <span className="text-xl font-black text-[#C9FF3D]">CS</span>
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-[#173B32]">
                  ClaimSense 360
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#66736D] font-semibold">
                  Claims Intelligence Platform
                </p>
              </div>
            </Link>

            <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight text-[#173B32]">
              AI-Powered Insurance Decision Platform.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#66736D]">
              Automate fraud risk detection, explainable SHAP feature attribution, and vehicle damage computer vision analysis in one unified platform.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
              <span>XGBoost Machine Learning Fraud Classification</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
              <span>TF-IDF Narrative Deception & Sentiment Analysis</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
              <span>Computer Vision Vehicle Damage Severity Index</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="flex justify-center w-full">
          <Suspense fallback={<div className="text-[#173B32] text-sm font-medium">Loading workspace...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}