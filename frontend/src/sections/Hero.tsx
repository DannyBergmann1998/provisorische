"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow — adapts to theme via accent color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 25% 65%, var(--accent-glow) 0%, transparent 60%)",
        }}
      />

      {/* Logo watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-3%] top-1/2 -translate-y-[52%] w-[500px] h-[500px] select-none"
        style={{ opacity: 0.025 }}
      >
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pt-32 pb-28">
        <div className="max-w-[680px]">

          <motion.p {...fadeUp(0.08)} className="text-label mb-8" style={{ color: "var(--accent)" }}>
            Handy & PC Service
          </motion.p>

          {/* Headline — editorial weight play */}
          <div className="mb-8 space-y-1">
            <motion.h1
              {...fadeUp(0.18)}
              style={{
                fontSize:      "clamp(2.6rem, 7.5vw, 6rem)",
                fontWeight:    800,
                letterSpacing: "-0.035em",
                lineHeight:    1.0,
                color:         "var(--text)",
              }}
            >
              Professionelle
            </motion.h1>
            <motion.h1
              {...fadeUp(0.26)}
              style={{
                fontSize:      "clamp(2.6rem, 7.5vw, 6rem)",
                fontWeight:    200,
                letterSpacing: "-0.03em",
                lineHeight:    1.0,
                color:         "var(--text-3)",
              }}
            >
              Reparaturen
            </motion.h1>
            <motion.h1
              {...fadeUp(0.34)}
              style={{
                fontSize:      "clamp(2.6rem, 7.5vw, 6rem)",
                fontWeight:    800,
                letterSpacing: "-0.035em",
                lineHeight:    1.0,
                color:         "var(--text)",
              }}
            >
              für deine Geräte.
            </motion.h1>
          </div>

          <motion.p
            {...fadeUp(0.44)}
            style={{
              fontSize:      "clamp(1rem, 2vw, 1.2rem)",
              fontWeight:    300,
              lineHeight:    1.7,
              color:         "var(--text-2)",
              maxWidth:      "420px",
              marginBottom:  "2.5rem",
            }}
          >
            Schnell, zuverlässig, transparent —
            für Smartphones, PCs, Laptops, Konsolen und Apple Geräte.
          </motion.p>

          <motion.div {...fadeUp(0.52)} className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => document.getElementById("leistungen")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-200 active:scale-[0.97] hover:brightness-110"
              style={{
                background: "var(--accent)",
                boxShadow:  "0 0 28px var(--accent-glow), 0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              Jetzt Diagnose starten
            </button>
            <button
              onClick={() => document.getElementById("preise")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-[15px] font-medium transition-all duration-200"
              style={{
                color:  "var(--text-2)",
                border: "1px solid var(--border-2)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              Preise ansehen
            </button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            {...fadeUp(0.64)}
            className="mt-16 pt-8 flex gap-10 sm:gap-14 flex-wrap"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {[
              { val: "500+", label: "Geräte repariert"   },
              { val: "24h",  label: "Ø Bearbeitungszeit" },
              { val: "4 ×",  label: "Reparaturkategorien"},
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

      {/* Scroll caret */}
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
