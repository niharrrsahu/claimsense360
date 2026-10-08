"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, AlertCircle, Loader2, UserCheck, ShieldAlert, FileText } from "lucide-react";
import { login } from "@/lib/auth";
import PageTransition from "@/components/shared/page-transition";

function LoginForm() {
  const router = useRouter();
  const [nextParam, setNextParam] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Policyholder" | "Adjuster" | "Admin">("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const next = params.get("next");
      if (next) {
        setNextParam(next);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const getTargetRedirect = (selectedRole: string) => {
    if (nextParam) return nextParam;
    if (selectedRole === "Policyholder") return "/claims/new";
    if (selectedRole === "Adjuster") return "/claims";
    return "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const nameFromEmail = email.includes("@")
        ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
        : "Nihar Sahu";

      const userInfo = {
        full_name: email === "admin@claimsense.ai" ? "Nihar Sahu" : nameFromEmail,
        email: email.trim(),
        role: role,
      };

      try {
        localStorage.setItem("cs_user_info", JSON.stringify(userInfo));
        document.cookie = `cs_user_info=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; max-age=86400; SameSite=Lax`;
      } catch {
        // ignore
      }

      await login(email, password);
      window.location.href = getTargetRedirect(role);
    } catch (err: any) {
      console.warn("API login notice:", err);
      setError(err?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: "Policyholder" | "Adjuster" | "Admin") => {
    const demoEmail =
      demoRole === "Policyholder"
        ? "customer@claimsense.ai"
        : demoRole === "Adjuster"
        ? "adjuster@claimsense.ai"
        : "admin@claimsense.ai";

    setEmail(demoEmail);
    setPassword("password123");
    setRole(demoRole);
    setError(null);
    setLoading(true);

    try {
      const userInfo = {
        full_name: demoRole === "Policyholder" ? "Rahul Sharma" : demoRole === "Adjuster" ? "Priya Verma" : "Nihar Sahu",
        email: demoEmail,
        role: demoRole,
      };

      try {
        localStorage.setItem("cs_user_info", JSON.stringify(userInfo));
        document.cookie = `cs_user_info=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; max-age=86400; SameSite=Lax`;
      } catch {
        // ignore
      }

      await login(demoEmail, "password123");
      window.location.href = getTargetRedirect(demoRole);
    } catch (err: any) {
      console.warn("Demo login notice:", err);
      setError(err?.message || "Invalid email or password. Please sign up first.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-3xl border border-[#173B32]/12 bg-white p-6 sm:p-8 shadow-[0_25px_70px_rgba(23,59,50,0.12)] text-[#101412]">
      {/* Header */}
      <div>
        <Link href="/" title="Go to Homepage" className="inline-block">
          <motion.button
            type="button"
            whileHover={{ scale: 1.15, rotate: 8 }}
            whileTap={{ scale: 0.9, rotate: -8 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101412] shadow-md hover:ring-2 hover:ring-[#C9FF3D] transition-all cursor-pointer"
          >
            <span className="text-base font-black text-[#C9FF3D]">CS</span>
          </motion.button>
        </Link>

        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#173B32]/70">
          Role-Based Access Portal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173B32]">
          Sign In to ClaimSense 360
        </h1>
        <p className="mt-1 text-xs text-[#66736D] font-medium leading-relaxed">
          Select your portal role to access appropriate claim workflows.
        </p>
      </div>

      {/* Role Selection Toggle */}
      <div className="mt-5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173B32]/70 mb-2">
          Select Login Role
        </label>
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#F4F1EA] p-1 border border-[#173B32]/10">
          <button
            type="button"
            onClick={() => setRole("Policyholder")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
              role === "Policyholder"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#66736D] hover:text-[#173B32]"
            }`}
          >
            <FileText size={14} className="mb-0.5" />
            Policyholder
          </button>

          <button
            type="button"
            onClick={() => setRole("Adjuster")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
              role === "Adjuster"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#66736D] hover:text-[#173B32]"
            }`}
          >
            <UserCheck size={14} className="mb-0.5" />
            Adjuster
          </button>

          <button
            type="button"
            onClick={() => setRole("Admin")}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
              role === "Admin"
                ? "bg-[#173B32] text-[#C9FF3D] shadow-sm"
                : "text-[#66736D] hover:text-[#173B32]"
            }`}
          >
            <ShieldAlert size={14} className="mb-0.5" />
            SIU Admin
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-700 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173B32]/70">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              role === "Policyholder"
                ? "customer@claimsense.ai"
                : role === "Adjuster"
                ? "adjuster@claimsense.ai"
                : "admin@claimsense.ai"
            }
            className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-3.5 py-3 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173B32]/70">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-3.5 py-3 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] py-3.5 font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50 mt-1"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Sign In as {role}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Role Login Buttons */}
      <div className="mt-4 pt-4 border-t border-[#173B32]/10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#66736D] text-center mb-2">
          Instant One-Click Demo Logins
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleDemoLogin("Policyholder")}
            disabled={loading}
            className="rounded-xl border border-[#173B32]/15 bg-[#173B32]/5 py-2 px-1 text-[10px] font-bold text-[#173B32] transition hover:bg-[#173B32]/15"
          >
            👤 Policyholder
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("Adjuster")}
            disabled={loading}
            className="rounded-xl border border-[#173B32]/15 bg-[#173B32]/5 py-2 px-1 text-[10px] font-bold text-[#173B32] transition hover:bg-[#173B32]/15"
          >
            🔍 Adjuster
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("Admin")}
            disabled={loading}
            className="rounded-xl border border-[#173B32]/15 bg-[#173B32]/5 py-2 px-1 text-[10px] font-bold text-[#173B32] transition hover:bg-[#173B32]/15"
          >
            🛡️ SIU Admin
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <p className="mt-4 text-center text-xs text-[#66736D] font-medium">
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
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#173B32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#E66A4E]/10 blur-3xl" />

      <PageTransition>
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-12 lg:grid lg:grid-cols-2 min-h-screen py-8">
          {/* Left Branding Side */}
          <div className="hidden lg:flex flex-col justify-between space-y-8 pr-6">
            <div>
              <motion.div whileHover={{ scale: 1.04, x: 4 }} className="inline-block">
                <Link href="/" className="inline-flex items-center gap-3 group cursor-pointer">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101412] shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:ring-2 group-hover:ring-[#C9FF3D] transition-all duration-300">
                    <span className="text-xl font-black text-[#C9FF3D]">CS</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold leading-none text-[#173B32] group-hover:text-[#E66A4E] transition-colors">
                      ClaimSense 360
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#66736D] font-semibold">
                      Claims Intelligence Platform
                    </p>
                  </div>
                </Link>
              </motion.div>

              <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight text-[#173B32]">
                Role-Based Insurance Intelligence Platform.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#66736D]">
                Structured workflows tailored for Policyholders (Claim Intake), Claims Adjusters (Risk Scoring &amp; SHAP), and SIU Investigators (Fraud Ring &amp; Fairness Audit).
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">👤</div>
                <span>Policyholder: Submit claims &amp; upload vehicle damage imagery</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">🔍</div>
                <span>Claims Adjuster: Review XGBoost + SHAP feature risk attribution</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">🛡️</div>
                <span>SIU Admin: Audit graph fraud rings &amp; algorithmic fairness</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <LoginForm />
          </div>
        </div>
      </PageTransition>
    </main>
  );
}