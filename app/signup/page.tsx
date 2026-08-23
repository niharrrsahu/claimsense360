"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { register } from "@/lib/auth";

import PageTransition from "@/components/shared/page-transition";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(fullName, email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#F4F1EA] p-4 text-[#101412] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#173B32]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#E66A4E]/10 blur-3xl" />

      <PageTransition>
        <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-12 lg:grid lg:grid-cols-2 min-h-screen py-8">
          {/* Left Branding Side - Desktop Only */}
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
                Join the Future of AI Insurance Auditing.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#66736D]">
                Create your Claims Intelligence workspace account to access machine learning fraud prediction, SHAP risk insights, and real-time damage analysis.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32] hover:translate-x-1 transition-transform">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
                <span>Instant Claims Adjuster Account Creation</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32] hover:translate-x-1 transition-transform">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
                <span>Role-Based Access Control & Audit Log Security</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#173B32] hover:translate-x-1 transition-transform">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#173B32]/10 text-[#173B32]">✓</div>
                <span>Real-Time Database Persistence & AI Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md rounded-3xl border border-[#173B32]/12 bg-white p-8 sm:p-10 shadow-[0_25px_70px_rgba(23,59,50,0.12)]">
              {/* Header */}
              <div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.9, rotate: -8 }}
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  title="Go to Homepage"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101412] shadow-md hover:ring-2 hover:ring-[#C9FF3D] transition-all cursor-pointer"
                >
                  <span className="text-lg font-black text-[#C9FF3D]">CS</span>
                </motion.button>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#173B32]/70">
                  Create Account
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173B32]">
                  Get Started with ClaimSense 360
                </h1>
                <p className="mt-1.5 text-xs text-[#66736D] font-medium leading-relaxed">
                  Enter your details to create your AI claims workspace account.
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="mt-2 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3.5 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white focus:ring-1 focus:ring-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@claimsense.ai"
                    className="mt-2 w-full rounded-2xl border border-[#173B32]/15 bg-[#F4F1EA] px-4 py-3.5 text-sm text-[#101412] placeholder-gray-400 outline-none transition focus:border-[#173B32] focus:bg-white focus:ring-1 focus:ring-[#173B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#173B32]/70">
                    Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
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
                      Register & Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Link */}
              <p className="mt-6 text-center text-xs text-[#66736D] font-medium">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#E66A4E] underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}


