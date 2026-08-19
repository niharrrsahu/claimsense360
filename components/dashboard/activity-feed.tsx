"use client";

import { CheckCircle2, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";


export interface ActivityItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  riskBand: string;
}

interface ActivityFeedProps {
  activities?: ActivityItem[];
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  return (
    <div className="rounded-3xl border border-[#173B32]/12 bg-white p-6 shadow-sm flex flex-col justify-between">

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B32]/10 text-[#173B32]">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-sans font-bold text-[#173B32]">Live Activity Feed</h3>
              <p className="text-xs text-[#173B32]/70 font-medium">Real-time claim updates</p>
            </div>

          </div>
        </div>

        {activities.length === 0 ? (
          <div className="mt-8 flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#173B32]/20 bg-[#F4F1EA]/50 p-6 text-center text-xs text-[#173B32]/70 font-medium">
            No recent activity recorded.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {activities.map((item) => {
              let Icon = CheckCircle2;
              let color = "text-[#173B32] bg-[#173B32]/10 border-[#173B32]/20";
              if (item.riskBand === "High risk") {
                Icon = ShieldAlert;
                color = "text-[#E66A4E] bg-[#FDF0ED] border-[#E66A4E]/20";
              } else if (item.riskBand === "Medium risk") {
                Icon = AlertTriangle;
                color = "text-[#D99A24] bg-[#FFF8E6] border-[#D99A24]/20";
              }

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={`/claims/${item.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-[#173B32]/10 bg-[#F4F1EA] p-3.5 transition-all duration-200 hover:border-[#173B32]/30 hover:bg-white hover:shadow-md cursor-pointer"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-[#101412] truncate group-hover:text-[#173B32]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#173B32]/70 truncate font-medium">
                        {item.subtitle}
                      </p>
                    </div>

                    <span className="hidden sm:inline-block text-[11px] text-[#173B32]/60 shrink-0 font-medium">
                      {item.time}
                    </span>

                  </Link>
                </motion.div>
              );

            })}
          </div>
        )}
      </div>
    </div>
  );
}