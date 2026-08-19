"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Brain, PlusCircle, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FloatingQuickAudit() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:block">

      {/* Expanded Quick Action Wheel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mb-3 flex flex-col gap-2.5 rounded-3xl border border-[#173B32]/15 bg-white p-4 shadow-2xl min-w-56"
          >
            <div className="flex items-center justify-between border-b border-[#173B32]/10 pb-2">
              <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#E66A4E]" /> Quick AI Desk
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#173B32]/60 hover:bg-[#F4F1EA] hover:text-[#173B32]"
              >
                <X size={14} />
              </button>
            </div>

            <Link
              href="/claims/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl bg-[#173B32] px-3.5 py-2.5 text-xs font-bold text-[#C9FF3D] hover:bg-[#23584b] transition active:scale-95 shadow-xs"
            >
              <span className="flex items-center gap-2 text-[#C9FF3D] font-bold">
                <PlusCircle size={15} /> Submit New Claim
              </span>
              <ArrowRight size={12} className="text-[#C9FF3D]" />
            </Link>

            <Link
              href="/fraud"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl bg-[#FDF0ED] border border-[#E66A4E]/30 px-3.5 py-2.5 text-xs font-bold text-[#E66A4E] hover:bg-[#E66A4E] hover:text-white transition active:scale-95 shadow-xs group"
            >
              <span className="flex items-center gap-2 font-bold group-hover:text-white">
                <ShieldAlert size={15} /> Fraud SIU Priority
              </span>
              <ArrowRight size={12} className="group-hover:text-white" />
            </Link>

            <Link
              href="/copilot"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl bg-[#F4F1EA] border border-[#173B32]/15 px-3.5 py-2.5 text-xs font-bold text-[#173B32] hover:bg-[#173B32] hover:text-[#C9FF3D] transition active:scale-95 shadow-xs group"
            >
              <span className="flex items-center gap-2 font-bold group-hover:text-[#C9FF3D]">
                <Brain size={15} /> Ask AI Copilot
              </span>
              <ArrowRight size={12} className="group-hover:text-[#C9FF3D]" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Floating Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173B32] text-[#C9FF3D] shadow-2xl ring-4 ring-[#C9FF3D]/30 transition-shadow hover:shadow-[#173B32]/40"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-spin-slow" />}
      </motion.button>
    </div>
  );
}
