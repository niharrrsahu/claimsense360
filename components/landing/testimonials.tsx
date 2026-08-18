"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      initials: "PS",
      name: "Priya Sharma",
      role: "Claims Manager",
      company: "ICICI Lombard",
      review:
        "ClaimSense 360 reduced our claim processing time by nearly 70%. The fraud detection is incredibly accurate.",
    },
    {
      initials: "RM",
      name: "Rahul Mehta",
      role: "Operations Head",
      company: "HDFC ERGO",
      review:
        "The Explainable AI feature gives our team confidence in every automated decision. It's a game changer.",
    },
    {
      initials: "AV",
      name: "Ananya Verma",
      role: "Fraud Investigation Lead",
      company: "Bajaj Allianz",
      review:
        "We now identify suspicious claims in minutes instead of days. The analytics dashboard is outstanding.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="scroll-mt-36 relative overflow-hidden bg-[#F4F1EA] px-6 py-24 sm:px-8 sm:py-28 lg:py-32"
    >
      {/* SUBTLE BACKGROUND */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#E66A4E]/5 blur-3xl" />

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
            Customer perspective
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#101412] sm:text-5xl lg:text-6xl"
          >
            Built for teams
            <span className="block text-[#173B32]">
              making better claim decisions.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#66736D] sm:text-lg"
          >
            See how ClaimSense 360 helps insurance teams process claims
            faster, investigate risk and make explainable decisions.
          </motion.p>
        </div>

        {/* REVIEWS */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
              }}
              className="group relative flex min-h-[410px] flex-col rounded-[28px] border border-[#173B32]/10 bg-white p-8 shadow-[0_8px_35px_rgba(23,59,50,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#2E6B5B]/25 hover:shadow-[0_20px_45px_rgba(23,59,50,0.10)]"
            >
              {/* TOP ROW */}
              <div className="flex items-start justify-between">
                <span className="font-serif text-5xl leading-none text-[#E66A4E]">
                  “
                </span>

                <span className="rounded-full border border-[#173B32]/10 bg-[#F4F1EA] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#2E6B5B]">
                  Sample feedback
                </span>
              </div>

              {/* REVIEW */}
              <p className="mt-8 text-[16px] leading-8 text-[#4F615B]">
                {review.review}
              </p>

              {/* DIVIDER */}
              <div className="mt-auto border-t border-[#173B32]/10 pt-7">
                <div className="flex items-center gap-4">
                  {/* INITIALS */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173B32] text-sm font-bold text-white transition-colors duration-300 group-hover:bg-[#2E6B5B]">
                    {review.initials}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-[#101412]">
                      {review.name}
                    </h3>

                    <p className="mt-0.5 text-sm text-[#7A847F]">
                      {review.role}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#2E6B5B]">
                      {review.company}
                    </p>
                  </div>
                </div>
              </div>

              {/* HOVER ACCENT */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 origin-left scale-x-0 bg-[#E66A4E] transition-transform duration-300 group-hover:scale-x-100" />
            </motion.article>
          ))}
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
            Faster claim processing
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E66A4E]" />
            AI-powered decisions
          </span>

          <span className="hidden h-4 w-px bg-[#173B32]/15 sm:block" />

          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2E6B5B]" />
            Explainable intelligence
          </span>
        </motion.div>
      </div>
    </section>
  );
}