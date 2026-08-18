"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change?: string | null;
  href?: string;
};

export default function StatCard({
  title,
  value,
  change,
  href,
}: StatCardProps) {
  const isNegative = change?.startsWith("-");

  let destination = href;
  if (!destination) {
    const tLower = title.toLowerCase();
    if (tLower.includes("total") || tLower.includes("matching")) destination = "/claims";
    else if (tLower.includes("high risk")) destination = "/fraud";
    else destination = "/analytics";
  }

  return (
    <Link href={destination}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="group cursor-pointer rounded-3xl border border-[#173B32]/12 bg-white p-5 transition-all duration-300 hover:border-[#173B32]/30 shadow-xs hover:shadow-lg h-full flex flex-col justify-between"
      >

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#173B32]/70 group-hover:text-[#173B32] transition-colors">
              {title}
            </p>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F1EA] text-[#173B32] transition-transform duration-300 group-hover:bg-[#173B32] group-hover:text-[#C9FF3D]">
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>

          <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-extrabold text-[#173B32] transition-transform duration-300 group-hover:scale-105 origin-left">
            {value}
          </h2>
        </div>

        {change ? (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 group-hover:scale-105 ${
                isNegative
                  ? "bg-[#FDF0ED] text-[#E66A4E]"
                  : "bg-[#173B32]/10 text-[#173B32]"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-500 font-medium">vs last month</span>
          </div>
        ) : (
          <div className="mt-4 h-6 text-xs text-[#173B32]/60 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B] animate-pulse" />
            <span className="group-hover:underline">Click to view details →</span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}