"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "12,450+",
    title: "Claims processed",
  },
  {
    value: "97.8%",
    title: "AI decision accuracy",
  },
  {
    value: "3.2 min",
    title: "Average processing time",
  },
  {
    value: "64%",
    title: "Investigator time saved",
  },
];

export default function Stats() {
  return (
    <section id="insights" className="scroll-mt-36 border-y border-[#173B32]/10 bg-[#E9E5DC] pt-12 pb-8 sm:pt-16 lg:pt-20">

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">

        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-8 lg:p-10 ${
              index !== 0
                ? "border-l border-[#173B32]/10"
                : ""
            }`}
          >
            <p className="font-serif text-4xl font-bold tracking-tight text-[#173B32] lg:text-5xl">
              {item.value}
            </p>

            <p className="mt-3 text-sm text-[#66736D]">
              {item.title}
            </p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}