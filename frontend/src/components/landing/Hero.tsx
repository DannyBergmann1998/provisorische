"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero() {
  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,113,227,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(245,245,247,0.5))",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-28 pb-20"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.08] text-xs font-medium text-[#6e6e73] tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] inline-block" />
            Kostenlose Diagnose inklusive
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1d1d1f] mb-6"
        >
          Schnelle Reparaturen.
          <br />
          <span className="text-[#0071e3]">Faire Preise.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-[clamp(1rem,2.5vw,1.25rem)] text-[#6e6e73] max-w-xl leading-relaxed font-light mb-10"
        >
          Professioneller Service für Smartphones, PCs und Laptops —
          persönlich, transparent und zuverlässig.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={scrollToContact}
            className="group px-7 py-3.5 rounded-full bg-[#0071e3] text-white text-[15px] font-medium transition-all duration-200 hover:bg-[#0077ed] active:scale-[0.97] shadow-[0_4px_20px_rgba(0,113,227,0.28)]"
          >
            Reparatur anfragen
            <span className="ml-2 inline-block group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </button>
          <button
            onClick={() => document.getElementById("leistungen")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3.5 rounded-full text-[15px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors duration-200"
          >
            Leistungen ansehen
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="mt-16 flex flex-col sm:flex-row items-center gap-8 sm:gap-12"
        >
          {[
            { value: "500+", label: "Reparaturen" },
            { value: "4.9★", label: "Bewertung" },
            { value: "24h", label: "Bearbeitungszeit" },
          ].map((stat, i) => (
            <div key={stat.value} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">{stat.value}</span>
              <span className="text-xs text-[#86868b] font-medium tracking-widest uppercase">{stat.label}</span>
              {i < 2 && <div className="hidden sm:block absolute w-px h-8 bg-[#e5e5ea] translate-x-[7rem]" />}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <span className="text-[10px] text-[#a1a1a6] tracking-[0.2em] uppercase font-medium">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-[#a1a1a6] to-transparent rounded-full"
          animate={{ opacity: [0.5, 0.15, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
