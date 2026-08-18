"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Car,
  FileText,
  Shield,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  desc: string;
  icon: LucideIcon;
  tag: string;
};

const features: Feature[] = [
  {
    title: "AI Fraud Detection",
    desc: "Identify suspicious claims instantly using machine learning.",
    icon: Shield,
    tag: "FRAUD INTELLIGENCE",
  },
  {
    title: "Damage Analysis",
    desc: "Computer vision estimates vehicle damage from uploaded images.",
    icon: Car,
    tag: "COMPUTER VISION",
  },
  {
    title: "Explainable AI",
    desc: "Every AI decision includes a transparent explanation.",
    icon: Brain,
    tag: "AI EXPLAINABILITY",
  },
  {
    title: "Risk Scoring",
    desc: "Automatically prioritize high-risk insurance claims.",
    icon: TrendingUp,
    tag: "PREDICTIVE RISK",
  },
  {
    title: "Analytics Dashboard",
    desc: "Monitor claims, fraud trends and KPIs in real time.",
    icon: BarChart3,
    tag: "INTELLIGENCE",
  },
  {
    title: "Claim History",
    desc: "Track every claim with a searchable audit trail.",
    icon: FileText,
    tag: "CLAIM MANAGEMENT",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-36 relative overflow-hidden bg-[#F4F1EA] px-6 py-24 sm:px-8 sm:py-28 lg:py-32"
    >

      {/* SUBTLE BACKGROUND ACCENT */}
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#2E6B5B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.22em] text-[#E66A4E]"
          >
            Everything you need
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#101412] sm:text-5xl lg:text-6xl"
          >
            Smart tools for
            <span className="block text-[#173B32]">
              smarter insurance claims.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#66736D] sm:text-lg"
          >
            Powerful AI tools for fraud detection, damage assessment,
            explainability and claim automation.
          </motion.p>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <motion.article

              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.35,
                delay: index * 0.05,
              }}
              className="group relative min-h-[285px] overflow-hidden rounded-[28px] border border-[#173B32]/10 bg-white p-8 shadow-[0_8px_35px_rgba(23,59,50,0.035)] transition-all duration-300 hover:border-[#2E6B5B]/40 hover:shadow-[0_20px_50px_rgba(23,59,50,0.12)] cursor-pointer"
            >

              {/* NUMBER */}
              <div className="absolute right-7 top-7 text-xs font-bold tracking-[0.15em] text-[#173B32]/20">
                0{index + 1}
              </div>

              {/* ICON */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F1EA] text-[#173B32] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#173B32] group-hover:text-white">
                <item.icon size={26} strokeWidth={1.75} />
              </div>

              {/* TAG */}
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E6B5B]">
                {item.tag}
              </p>

              {/* TITLE */}
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-[#101412]">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#66736D]">
                {item.desc}
              </p>

              {/* BOTTOM ACCENT */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 origin-left scale-x-0 bg-[#E66A4E] transition-transform duration-300 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </div>

        {/* FEATURE SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium uppercase tracking-[0.13em] text-[#7A847F]"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
            Fraud intelligence
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
            Damage AI
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
            Explainable decisions
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
            Real-time analytics
          </span>
        </motion.div>
      </div>
    </section>
  );
}


// "use client";

// import { motion } from "framer-motion";

// export default function Features() {
//   const features = [
//     {
//       title: "AI Fraud Detection",
//       desc: "Identify suspicious claims instantly using machine learning.",
//       icon: "🛡️",
//       tag: "FRAUD INTELLIGENCE",
//     },
//     {
//       title: "Damage Analysis",
//       desc: "Computer vision estimates vehicle damage from uploaded images.",
//       icon: "🚗",
//       tag: "COMPUTER VISION",
//     },
//     {
//       title: "Explainable AI",
//       desc: "Every AI decision includes a transparent explanation.",
//       icon: "🧠",
//       tag: "AI EXPLAINABILITY",
//     },
//     {
//       title: "Risk Scoring",
//       desc: "Automatically prioritize high-risk insurance claims.",
//       icon: "📈",
//       tag: "PREDICTIVE RISK",
//     },
//     {
//       title: "Analytics Dashboard",
//       desc: "Monitor claims, fraud trends and KPIs in real time.",
//       icon: "📊",
//       tag: "INTELLIGENCE",
//     },
//     {
//       title: "Claim History",
//       desc: "Track every claim with a searchable audit trail.",
//       icon: "📄",
//       tag: "CLAIM MANAGEMENT",
//     },
//   ];

//   return (
//     <section
//       id="features"
//       className="relative overflow-hidden bg-[#F4F1EA] px-6 py-24 sm:px-8 sm:py-28 lg:py-32"
//     >
//       {/* SUBTLE BACKGROUND ACCENT */}
//       <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#2E6B5B]/5 blur-3xl" />

//       <div className="relative mx-auto max-w-7xl">
//         {/* SECTION HEADER */}
//         <div className="mx-auto max-w-4xl text-center">
//           <motion.p
//             initial={{ opacity: 0, y: 15 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.5 }}
//             className="text-xs font-bold uppercase tracking-[0.22em] text-[#E66A4E]"
//           >
//             Everything you need
//           </motion.p>

//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.6, delay: 0.05 }}
//             className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#101412] sm:text-5xl lg:text-6xl"
//           >
//             Smart tools for
//             <span className="block text-[#173B32]">
//               smarter insurance claims.
//             </span>
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 15 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.5, delay: 0.12 }}
//             className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#66736D] sm:text-lg"
//           >
//             Powerful AI tools for fraud detection, damage assessment,
//             explainability and claim automation.
//           </motion.p>
//         </div>

//         {/* FEATURE GRID */}
//         <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//           {features.map((item, index) => (
//             <motion.article
//               key={item.title}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.15 }}
//               transition={{
//                 duration: 0.55,
//                 delay: index * 0.07,
//               }}
//               className="group relative min-h-[285px] overflow-hidden rounded-[28px] border border-[#173B32]/10 bg-white p-8 shadow-[0_8px_35px_rgba(23,59,50,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#2E6B5B]/30 hover:shadow-[0_20px_50px_rgba(23,59,50,0.10)]"
//             >
//               {/* NUMBER */}
//               <div className="absolute right-7 top-7 text-xs font-bold tracking-[0.15em] text-[#173B32]/20">
//                 0{index + 1}
//               </div>

//               {/* ICON */}
//               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F1EA] text-3xl transition-transform duration-300 group-hover:scale-110">
//                 {item.icon}
//               </div>

//               {/* TAG */}
//               <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E6B5B]">
//                 {item.tag}
//               </p>

//               {/* TITLE */}
//               <h3 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-[#101412]">
//                 {item.title}
//               </h3>

//               {/* DESCRIPTION */}
//               <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#66736D]">
//                 {item.desc}
//               </p>

//               {/* BOTTOM ACCENT */}
//               <div className="absolute bottom-0 left-8 right-8 h-0.5 origin-left scale-x-0 bg-[#E66A4E] transition-transform duration-300 group-hover:scale-x-100" />
//             </motion.article>
//           ))}
//         </div>

//         {/* FEATURE SUMMARY */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium uppercase tracking-[0.13em] text-[#7A847F]"
//         >
//           <span className="flex items-center gap-2">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
//             Fraud intelligence
//           </span>

//           <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

//           <span className="flex items-center gap-2">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
//             Damage AI
//           </span>

//           <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

//           <span className="flex items-center gap-2">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
//             Explainable decisions
//           </span>

//           <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

//           <span className="flex items-center gap-2">
//             <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
//             Real-time analytics
//           </span>
//         </motion.div>
//       </div>
//     </section>
//   );
// }