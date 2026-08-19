"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, ShieldCheck, ChevronDown, ExternalLink } from "lucide-react";
import { logout } from "@/lib/auth";


interface TopNavbarProps {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
}

export default function TopNavbar({
  userName = "Nihar Sahu",
  userRole = "Claims Specialist",
  userEmail,
}: TopNavbarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when user clicks anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      router.push(`/claims?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const safeUserName = userName || "Nihar Sahu";
  const initial = safeUserName.charAt(0).toUpperCase();
  const displayEmail = userEmail || (safeUserName.toLowerCase().includes("nihar") ? "niharrrsahu@gmail.com" : `${safeUserName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`);



  return (
    <header className="flex h-16 items-center justify-between border-b border-[#173B32]/10 bg-[#F4F1EA] px-4 pl-16 sm:px-6 lg:pl-6 sticky top-0 z-30 shadow-xs">

      {/* Left Title */}
      <div className="min-w-0">
        <p className="text-base sm:text-lg font-sans font-bold text-[#173B32] tracking-tight truncate">
          Insurance Claims Intelligence
        </p>
        <p className="text-[11px] sm:text-xs text-[#173B32]/70 font-medium truncate">
          Welcome, <span className="text-[#E66A4E] font-semibold">{userName}</span> 👋
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input */}
        <div className="hidden md:flex items-center gap-2.5 rounded-2xl border border-[#173B32]/15 bg-white px-3.5 py-2 text-sm text-[#101412] shadow-sm focus-within:border-[#173B32] transition">
          <Search className="text-[#173B32]/60 shrink-0" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search claims..."
            className="bg-transparent text-[#101412] outline-none placeholder:text-[#173B32]/40 w-36 lg:w-48 text-xs font-medium"
          />
        </div>

        {/* Interactive User Profile Dropdown Pill with Click-Outside Ref */}
        <div ref={profileRef} className="relative">

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-[#173B32]/20 bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-xs hover:border-[#173B32]/40 transition cursor-pointer"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#173B32] font-bold text-[#C9FF3D] text-xs sm:text-sm shadow-2xs">
              {initial}
            </div>
            <div className="hidden sm:block text-left">
              <h3 className="text-xs font-bold text-[#173B32] leading-none">
                {userName}
              </h3>
              <p className="text-[10px] text-[#173B32]/60 mt-0.5 capitalize font-medium">
                {userRole}
              </p>
            </div>
            <ChevronDown size={14} className={`text-[#173B32]/60 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </motion.button>

          {/* Profile Popover Modal */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute right-0 mt-2 w-72 rounded-3xl border border-[#173B32]/15 bg-white p-4 shadow-2xl z-50 space-y-3"
              >
                {/* Header User Account Card */}
                <div className="flex items-start gap-3 border-b border-[#173B32]/10 pb-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173B32] font-bold text-[#C9FF3D] text-base shadow-sm shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-serif font-bold text-[#101412] truncate">{safeUserName}</h4>
                    <p className="text-[11px] text-[#173B32]/70 font-medium truncate">{displayEmail}</p>


                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF7EE] text-[#173B32] px-2 py-0.5 text-[10px] font-bold border border-[#173B32]/20">
                        <ShieldCheck size={11} /> Level 4 Officer
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#F4F1EA] text-[#173B32]/80 px-2 py-0.5 text-[10px] font-medium border border-[#173B32]/10">
                        SIU Desk #4
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Details & Department Info */}
                <div className="rounded-2xl bg-[#F4F1EA] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#173B32]/70 font-medium">Assigned Division:</span>
                    <span className="font-bold text-[#101412]">Motor Fraud Unit</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#173B32]/70 font-medium">Session Status:</span>
                    <span className="font-bold text-[#173B32] flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#173B32] animate-pulse" /> Active (JWT)
                    </span>
                  </div>
                </div>

                {/* Account Actions & Quick Nav */}
                <div className="space-y-1 pt-1 border-t border-[#173B32]/10">
                  <Link
                    href="/fraud"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#173B32] hover:bg-[#F4F1EA] transition"
                  >
                    <span>🛡️ SIU Priority Queue</span>
                    <ExternalLink size={12} />
                  </Link>

                  <Link
                    href="/copilot"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#173B32] hover:bg-[#F4F1EA] transition"
                  >
                    <span>🤖 Ask AI Copilot</span>
                    <ExternalLink size={12} />
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsProfileOpen(false);
                      try {
                        await logout();
                      } catch (e) {
                        window.location.href = "/login";
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#E66A4E] hover:bg-[#FDF0ED] transition cursor-pointer"
                  >
                    <span>🚪 Sign Out Officer Account</span>
                    <ExternalLink size={12} />
                  </button>

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Claim CTA */}
        <Link
          href="/claims/new"
          className="flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-[#E66A4E] hover:bg-[#d5593d] px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Claim</span>
        </Link>
      </div>
    </header>
  );
}