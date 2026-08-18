"use client";

import { useState } from "react";
import { ArrowUp, CheckCircle, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [modalContent, setModalContent] = useState<{ title: string; body: string; badge: string } | null>(null);

  return (
    <footer className="border-t border-white/10 bg-[#0B1120] text-white relative">
      {/* INTERACTIVE COMPLIANCE MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-[#101827] p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="rounded-full bg-[#C9FF3D]/10 px-3 py-1 text-xs font-bold text-[#C9FF3D]">
                {modalContent.badge}
              </span>
              <button
                onClick={() => setModalContent(null)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <h4 className="mt-4 font-serif text-xl font-bold text-white">{modalContent.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{modalContent.body}</p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-6 w-full rounded-full bg-[#C9FF3D] py-3 text-sm font-bold text-[#0B1120] hover:bg-[#a8df24] transition-all cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">


        {/* TOP INTERACTIVE NEWSLETTER CARD */}
        <div className="mb-14 rounded-3xl border border-white/12 bg-white/[0.03] p-8 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9FF3D]">
              Stay Ahead of Fraud Tactics
            </span>
            <h3 className="mt-2 text-2xl font-bold font-serif text-white">
              Subscribe to ClaimSense Fraud Digest
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Get monthly insights on vehicle damage AI models, SHAP explainability, and fraud trends.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-3 rounded-full bg-[#EAF4EE] px-6 py-3.5 text-sm font-bold text-[#2E6B5B] shadow-md animate-bounce">
              <CheckCircle size={18} />
              <span>Subscribed to Fraud Digest!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto items-center gap-2">
              <div className="relative flex-1 lg:w-72">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="Enter officer email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#C9FF3D] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-[#C9FF3D] px-6 py-3 text-sm font-bold text-[#0B1120] transition-all hover:bg-[#a8df24] hover:scale-105 shrink-0 cursor-pointer"
              >
                Join Digest
              </button>
            </form>
          )}
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-16">

          {/* BRAND */}
          <div className="min-w-0">
            <div className="mb-6">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
                className="inline-block group cursor-pointer"
              >

                <h2 className="!m-0 !text-4xl !font-bold !leading-none !tracking-[-0.04em] !text-white sm:!text-5xl group-hover:opacity-90 transition-opacity">
                  ClaimSense
                  <span className="block text-[#C9FF3D]">360</span>
                </h2>
              </a>
            </div>


            <p className="max-w-md !text-base !leading-7 !text-white/60">
              AI-powered insurance claims platform built with Explainable AI,
              Computer Vision and Machine Learning.
            </p>

            {/* TECHNOLOGY TAGS */}
            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 hover:border-[#C9FF3D] hover:text-[#C9FF3D] transition-colors cursor-default">
                Explainable AI (SHAP)
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 hover:border-[#C9FF3D] hover:text-[#C9FF3D] transition-colors cursor-default">
                Computer Vision
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 hover:border-[#C9FF3D] hover:text-[#C9FF3D] transition-colors cursor-default">
                XGBoost ML Engine
              </span>
            </div>
          </div>

          {/* PLATFORM NAV */}
          <div>
            <h3 className="!mb-6 !text-lg !font-semibold !leading-6 !text-white">
              Platform
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="#intelligence" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Fraud Detection Engine
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Damage Computer Vision
                </a>
              </li>
              <li>
                <a href="#platform" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Explainable AI (SHAP)
                </a>
              </li>
              <li>
                <a href="#insights" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Real-time Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* WORKSPACE NAV */}
          <div>
            <h3 className="!mb-6 !text-lg !font-semibold !leading-6 !text-white">
              Workspace
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/dashboard" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Claims Dashboard
                </a>
              </li>
              <li>
                <a href="/claims/new" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Submit New Claim
                </a>
              </li>
              <li>
                <a href="/fraud" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Fraud Priority Queue
                </a>
              </li>
              <li>
                <a href="/copilot" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  AI Claims Copilot
                </a>
              </li>
            </ul>
          </div>

          {/* ACCESS & LEGAL */}
          <div>
            <h3 className="!mb-6 !text-lg !font-semibold !leading-6 !text-white">
              Account & Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/login" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Sign In (Officer)
                </a>
              </li>
              <li>
                <a href="/signup" className="text-sm text-white/60 transition-colors duration-200 hover:text-[#C9FF3D]">
                  Register Account
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalContent({
                    badge: "SOC2 TYPE II CERTIFIED",
                    title: "Enterprise SOC2 Type II Security",
                    body: "ClaimSense 360 undergoes annual independent auditing. All claim data is encrypted at rest with AES-256 and in transit via TLS 1.3 with strict role-based access control."
                  })}
                  className="text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-[#C9FF3D] cursor-pointer text-left"
                >
                  Enterprise SOC2 Type II
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalContent({
                    badge: "DPDP ACT 2023 COMPLIANT",
                    title: "Privacy Policy & Data Governance",
                    body: "We adhere strictly to India DPDP Act 2023 guidelines. Claim data, policyholder PII, and vehicle evidence are processed solely for fraud audit purposes and never sold."
                  })}
                  className="text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-[#C9FF3D] cursor-pointer text-left"
                >
                  Privacy Policy & Terms
                </button>
              </li>

            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-12 h-px bg-white/10" />

        {/* BOTTOM ROW */}
        <div className="flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="!m-0 !text-sm !text-white/40">
            © 2026 ClaimSense 360 Inc. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-xs uppercase tracking-[0.16em] text-white/40">
              Claims Intelligence
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9FF3D]" />
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-[#C9FF3D] hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}