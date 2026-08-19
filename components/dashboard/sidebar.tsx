"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  BarChart3,
  Brain,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { logout } from "@/lib/auth";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Claims",
    icon: FileText,
    href: "/claims",
  },
  {
    title: "Fraud Detection",
    icon: ShieldAlert,
    href: "/fraud",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "AI Copilot",
    icon: Brain,
    href: "/copilot",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B32] text-[#C9FF3D] shadow-xl lg:hidden active:scale-95"
      >
        <Menu size={22} />
      </button>



      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#173B32]/15 bg-[#173B32] text-white shadow-2xl transition-all duration-300 ${
          collapsed ? "lg:w-16" : "lg:w-60"
        } ${
          mobileOpen ? "translate-x-0 w-60" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Toggle Section */}
        <div className={`flex items-center border-b border-white/10 p-3.5 ${collapsed ? "justify-center px-2" : "justify-between pl-4 pr-3"}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              title="Expand Sidebar"
              className="flex h-10 w-10 aspect-square shrink-0 items-center justify-center rounded-full bg-[#101412] font-extrabold text-[#C9FF3D] shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <span className="text-sm font-black text-[#C9FF3D]">CS</span>
            </button>
          ) : (
            <>
              <Link
                href="/dashboard"
                onClick={(e) => {
                  if (pathname === "/dashboard") {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}

                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="flex h-10 w-10 aspect-square shrink-0 items-center justify-center rounded-full bg-[#101412] font-extrabold text-[#C9FF3D] shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[#C9FF3D]/40 group-hover:ring-2 group-hover:ring-[#C9FF3D]/60 transition-all duration-300">
                  <span className="text-sm font-black text-[#C9FF3D]">CS</span>
                </div>

                <div className="whitespace-nowrap transition-opacity duration-200">
                  <p className="text-sm font-bold leading-none text-white tracking-tight group-hover:text-[#C9FF3D] transition-colors">
                    ClaimSense 360
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-[#C9FF3D] font-semibold">
                    Claims Intelligence
                  </p>
                </div>

              </Link>

              {/* Desktop Collapse Toggle Button */}
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="Collapse Sidebar"
                className="hidden lg:flex rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-[#C9FF3D] transition active:scale-95 shrink-0 cursor-pointer"
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>


        {/* Navigation Links */}
        <nav className="flex-1 px-2.5 py-5 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.title : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-[#C9FF3D] shadow-md text-[#101412] font-bold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={18} className={active ? "text-[#101412] shrink-0" : "text-white/80 shrink-0"} />
                
                {!collapsed && (
                  <span className={`font-bold tracking-tight whitespace-nowrap ${active ? "text-[#101412]" : "text-white/80"}`}>
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logout Action */}
        <div className="border-t border-white/10 p-2.5">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-[#E66A4E] hover:bg-[#E66A4E]/15 transition active:scale-95 ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Spacer to push main content right according to sidebar state */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      />
    </>
  );
}