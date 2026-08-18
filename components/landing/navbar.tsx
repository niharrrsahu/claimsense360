"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#insights", label: "Insights" },
  { href: "#testimonials", label: "Reviews" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("platform");

  useEffect(() => {
    const sectionIds = LINKS.map((l) => l.href.substring(1));

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 260;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 pt-5 sm:px-8">
      <nav className="mx-auto max-w-[1450px] rounded-[28px] border border-[#173B32]/10 bg-[#F4F1EA]/90 shadow-[0_8px_30px_rgba(23,59,50,0.05)] backdrop-blur-md lg:rounded-full">
        <div className="flex items-center justify-between px-6 py-3.5 lg:px-7">
          {/* LOGO */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >

            <motion.div
              whileTap={{ rotate: 360, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101412] shadow-sm transition-transform duration-300 group-hover:scale-105"
            >
              <span className="text-base font-black text-[#C8F000]">CS</span>
            </motion.div>

            <div className="hidden sm:block">
              <p className="text-base font-bold leading-none text-[#101412] group-hover:text-[#2E6B5B] transition-colors">
                ClaimSense 360
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#7A847F]">
                Claims Intelligence
              </p>
            </div>
          </a>



          {/* NAVIGATION — desktop with Scroll Spy Highlight */}
          <div className="hidden items-center gap-2 lg:flex">
            {LINKS.map((link) => {
              const id = link.href.substring(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveSection(id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#101412] text-[#C8F000] shadow-sm scale-105"
                      : "text-[#101412] hover:text-[#2E6B5B] hover:bg-[#101412]/5"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>


          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className="hidden px-4 py-3 text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B] sm:block"
            >
              Sign in
            </a>

            <Link
              href="/dashboard"
              className="rounded-full bg-[#101412] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173B32]"
            >
              Open Platform
              <span className="ml-2">→</span>
            </Link>

            {/* MOBILE TOGGLE */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#173B32]/15 text-[#101412] transition-colors hover:bg-[#101412]/5 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex flex-col gap-1 border-t border-[#173B32]/10 px-6 pb-5 pt-4">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[#101412] transition-colors hover:bg-[#101412]/5"
                  >
                    {link.label}
                  </a>
                ))}

                <a
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-[#2E6B5B]"
                >
                  Sign in
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}


// "use client";

// export default function Navbar() {
//   return (
//     <header className="fixed left-0 right-0 top-0 z-50 px-6 pt-5 sm:px-8">
//       <nav className="mx-auto flex max-w-[1450px] items-center justify-between rounded-full border border-[#173B32]/10 bg-[#F4F1EA]/90 px-6 py-4 shadow-[0_8px_30px_rgba(23,59,50,0.05)] backdrop-blur-md lg:px-7">
        
//         {/* LOGO */}
//         <a href="/" className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#101412]">
//             <span className="text-lg font-black text-[#C8F000]">
//               CS
//             </span>
//           </div>

//           <div className="hidden sm:block">
//             <p className="text-lg font-bold leading-none text-[#101412]">
//               ClaimSense 360
//             </p>

//             <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#7A847F]">
//               Claims Intelligence
//             </p>
//           </div>
//         </a>

//         {/* NAVIGATION */}
//         <div className="hidden items-center gap-8 lg:flex">
//           <a
//             href="#platform"
//             className="text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B]"
//           >
//             Platform
//           </a>

//           <a
//             href="#intelligence"
//             className="text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B]"
//           >
//             Intelligence
//           </a>

//           <a
//             href="#how-it-works"
//             className="text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B]"
//           >
//             How It Works
//           </a>

//           <a
//             href="#insights"
//             className="text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B]"
//           >
//             Insights
//           </a>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex items-center gap-3">
//           <a
//             href="/signin"
//             className="hidden px-4 py-3 text-sm font-semibold text-[#101412] transition-colors hover:text-[#2E6B5B] sm:block"
//           >
//             Sign in
//           </a>

//           <a
//             href="/platform"
//             className="rounded-full bg-[#101412] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173B32]"
//           >
//             Open Platform
//             <span className="ml-2">→</span>
//           </a>
//         </div>
//       </nav>
//     </header>
//   );
// }