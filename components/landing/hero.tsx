"use client";



import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-[700px]"
    >
      {/* EYEBROW */}
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#E66A4E]" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E6B5B]">
          AI Insurance Intelligence
        </span>
      </div>

      {/* HEADING */}
      <h1 className="font-serif text-[36px] font-semibold leading-[1.04] tracking-[-0.035em] text-[#173B32] sm:text-[46px] lg:text-[54px]">
        Insurance decisions,
        <br />
        <span className="italic text-[#E66A4E]">made intelligent.</span>
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-2.5 max-w-[520px] text-sm sm:text-base leading-6 text-[#66736D]">
        ClaimSense 360 brings fraud intelligence, vehicle damage analysis,
        predictive risk and explainable AI into one decision platform for
        modern insurance teams.
      </p>

      {/* CTA BUTTONS */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="hero-primary-button group inline-flex items-center rounded-full bg-[#173B32] px-5 py-2.5 text-xs sm:text-sm font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E6B5B] hover:shadow-md"
        >
          <span>Explore the platform</span>
          <span className="ml-2.5 inline-block transition-all duration-300 group-hover:ml-4">
            →
          </span>
        </Link>

        <a
          href="#intelligence"
          className="hero-secondary-button inline-flex items-center rounded-full border border-[#173B32]/20 px-5 py-2.5 text-xs sm:text-sm font-semibold !text-[#173B32] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E66A4E] hover:!text-[#E66A4E] hover:shadow-xs"
        >
          <span>Try the live risk analyzer</span>
          <span className="ml-2 transition-transform duration-300">↓</span>
        </a>
      </div>

      {/* TRUST LINE */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#7A847F]">
        <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
          ✓ Fraud intelligence
        </span>
        <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
          ✓ Damage AI
        </span>
        <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
          ✓ Explainable decisions
        </span>
      </div>





    </motion.div>

  );
}



// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Hero() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 35 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//       className="max-w-[700px]"
//     >
//       {/* EYEBROW */}
//       <div className="mb-7 flex items-center gap-3">
//         <span className="h-2 w-2 rounded-full bg-[#E66A4E]" />

//         <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E6B5B]">
//           AI Insurance Intelligence
//         </span>
//       </div>

//       {/* HEADING */}
//       <h1 className="font-serif text-[52px] font-semibold leading-[0.98] tracking-[-0.035em] text-[#173B32] sm:text-[64px] lg:text-[76px]">
//         Insurance decisions,
//         <br />

//         <span className="italic text-[#E66A4E]">
//           made intelligent.
//         </span>
//       </h1>

//       {/* DESCRIPTION */}
//       <p className="mt-8 max-w-[590px] text-lg leading-8 text-[#66736D]">
//         ClaimSense 360 brings fraud intelligence, vehicle damage analysis,
//         predictive risk and explainable AI into one decision platform for
//         modern insurance teams.
//       </p>

//       {/* CTA BUTTONS */}
//       <div className="mt-10 flex flex-wrap items-center gap-4">
//         {/* PRIMARY CTA */}
//         <Link
//           href="/dashboard"
//           className="hero-primary-button group inline-flex items-center rounded-full bg-[#173B32] px-7 py-4 text-sm font-bold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E6B5B] hover:shadow-lg"
//         >
//           <span>Explore the platform</span>

//           <span className="ml-3 inline-block transition-all duration-300 group-hover:ml-5">
//             →
//           </span>
//         </Link>

//         {/* SECONDARY CTA */}
//         <Link
//           href="#how-it-works"
//           className="hero-secondary-button inline-flex items-center rounded-full border border-[#173B32]/20 px-7 py-4 text-sm font-semibold !text-[#173B32] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E66A4E] hover:!text-[#E66A4E] hover:shadow-sm"
//         >
//           <span>See how it works</span>

//           <span className="ml-2 transition-transform duration-300">
//             ↓
//           </span>
//         </Link>
//       </div>

//       {/* TRUST LINE */}
//       <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-[#7A847F]">
//         <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
//           ✓ Fraud intelligence
//         </span>

//         <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
//           ✓ Damage AI
//         </span>

//         <span className="transition-colors duration-200 hover:text-[#2E6B5B]">
//           ✓ Explainable decisions
//         </span>
//       </div>
//     </motion.div>
//   );
// }