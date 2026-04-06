"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Single, restrained ambient glow — not gradient spam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(10,132,255,0.04) 0%, transparent 65%)",
        }}
      />

      {/* Logo watermark — barely visible, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-2%] top-1/2 -translate-y-[55%] w-[520px] h-[520px] select-none"
        style={{ opacity: 0.022 }}
      >
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      {/* Main content — left-aligned editorial layout */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-32 pb-28">
        <div className="max-w-[640px]">

          {/* Overline */}
          <motion.p {...fadeUp(0.08)} className="text-label mb-10" style={{ color: "var(--text-3)" }}>
            Handy & PC Service
          </motion.p>

          {/* Display headline — weight contrast is the design */}
          <div className="mb-10 space-y-1">
            <motion.h1
              {...fadeUp(0.18)}
              style={{
                fontSize:      "clamp(3rem, 9vw, 6.5rem)",
                fontWeight:    800,
                letterSpacing: "-0.035em",
                lineHeight:    1.0,
                color:         "var(--text)",
              }}
            >
              Schnelle
            </motion.h1>
            <motion.h1
              {...fadeUp(0.26)}
              style={{
                fontSize:      "clamp(3rem, 9vw, 6.5rem)",
                fontWeight:    200,
                letterSpacing: "-0.03em",
                lineHeight:    1.0,
                color:         "var(--text-3)",
              }}
            >
              Reparaturen.
            </motion.h1>
            <motion.h1
              {...fadeUp(0.34)}
              style={{
                fontSize:      "clamp(1.8rem, 5vw, 4rem)",
                fontWeight:    700,
                letterSpacing: "-0.025em",
                lineHeight:    1.1,
                paddingTop:    "0.15em",
                color:         "var(--accent)",
              }}
            >
              Faire Preise.
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.44)}
            style={{
              fontSize:   "clamp(1rem, 2vw, 1.125rem)",
              fontWeight: 300,
              lineHeight: 1.7,
              color:      "var(--text-2)",
              maxWidth:   "440px",
              marginBottom: "2.5rem",
            }}
          >
            Professioneller Service für Smartphones, PCs und Laptops —
            persönlich, transparent und zuverlässig.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.54)} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110"
              style={{
                background:  "var(--accent)",
                boxShadow:   "0 0 28px rgba(10,132,255,0.22), 0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              Reparatur anfragen
            </button>

            <button
              onClick={() => document.getElementById("leistungen")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-[15px] font-medium transition-all duration-200 hover:bg-white/[0.05]"
              style={{
                color:  "var(--text-2)",
                border: "1px solid var(--border-2)",
              }}
            >
              Leistungen ansehen
            </button>
          </motion.div>

          {/* Thin rule + two key stats */}
          <motion.div
            {...fadeUp(0.66)}
            className="mt-16 pt-8 flex gap-10"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {[
              { val: "500+", label: "Geräte repariert"   },
              { val: "24h",  label: "Ø Bearbeitungszeit" },
            ].map((s) => (
              <div key={s.val}>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>
                  {s.val}
                </p>
                <p style={{ fontSize: "12px", marginTop: "2px", color: "var(--text-3)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <motion.div
          className="w-px h-12 mx-auto rounded-full"
          style={{ background: "linear-gradient(to bottom, var(--text-3), transparent)" }}
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
