"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Claim",
      description:
        "Upload accident photos, policy details and claim documents securely.",
      label: "CLAIM INTAKE",
    },
    {
      number: "02",
      title: "AI Analysis",
      description:
        "AI extracts vehicle information and validates the submitted documents.",
      label: "AI PROCESSING",
    },
    {
      number: "03",
      title: "Fraud Detection",
      description:
        "Machine learning identifies suspicious patterns and calculates fraud risk.",
      label: "FRAUD INTELLIGENCE",
    },
    {
      number: "04",
      title: "Damage Analysis",
      description:
        "Computer vision analyzes vehicle images and estimates damage severity.",
      label: "COMPUTER VISION",
    },
    {
      number: "05",
      title: "Generate Decision",
      description:
        "The platform combines all signals into an explainable claim decision.",
      label: "AI DECISION",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-36 relative overflow-hidden bg-[#F4F1EA] px-6 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >


      {/* BACKGROUND ACCENT */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#2E6B5B]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-[0.22em] text-[#E66A4E]"
          >
            How it works
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#101412] sm:text-4xl lg:text-5xl"
          >
            From claim upload
            <span className="block text-[#173B32]">
              to intelligent decision.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#66736D]"
          >
            ClaimSense 360 transforms claim documents and vehicle evidence
            into a faster, explainable insurance decision.
          </motion.p>
        </div>

        {/* STEPS */}
        <div className="relative mt-9">

          {/* CONNECTING LINE — DESKTOP */}
          <div className="absolute left-[10%] right-[10%] top-[43px] hidden h-px bg-[#173B32]/15 lg:block" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="group relative rounded-[28px] border border-[#173B32]/10 bg-white p-7 shadow-[0_8px_35px_rgba(23,59,50,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#2E6B5B]/30 hover:shadow-[0_20px_45px_rgba(23,59,50,0.10)]"
              >
                {/* NUMBER */}
                <div className="relative z-10 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#173B32] text-lg font-bold text-white shadow-[0_8px_20px_rgba(23,59,50,0.18)] transition-all duration-300 group-hover:bg-[#E66A4E]">
                  {step.number}
                </div>

                {/* LABEL */}
                <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E6B5B]">
                  {step.label}
                </p>

                {/* TITLE */}
                <h3 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.025em] text-[#101412]">
                  {step.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-4 text-[15px] leading-7 text-[#66736D]">
                  {step.description}
                </p>

                {/* STEP ARROW */}
                {index < steps.length - 1 && (
                  <div className="mt-7 hidden text-xl text-[#E66A4E] lg:block">
                    →
                  </div>
                )}

                {/* BOTTOM ACCENT */}
                <div className="absolute bottom-0 left-7 right-7 h-0.5 origin-left scale-x-0 bg-[#E66A4E] transition-transform duration-300 group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>
        </div>

        {/* BOTTOM TRUST LINE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-medium uppercase tracking-[0.13em] text-[#7A847F]"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
            Secure claim intake
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
            AI-powered analysis
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
            Explainable decision
          </span>
        </motion.div>
      </div>
    </section>
  );
}