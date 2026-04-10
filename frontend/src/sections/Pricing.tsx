"use client";

import { motion } from "framer-motion";

const points = [
  "Transparente Preise — kein Überraschungseffekt",
  "Keine versteckten Kosten",
  "Diagnosegebühr wird bei Reparatur angerechnet",
];

export function Pricing() {
  return (
    <section id="preise" className="py-24 lg:py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Label */}
        <motion.p
          className="text-label mb-4"
          style={{ color: "var(--accent)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        >
          Diagnose & Preise
        </motion.p>

        {/* Two-column: price left, points right */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">

          {/* Left — price */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <div
              className="inline-block rounded-3xl px-10 py-9"
              style={{
                background: "var(--surface)",
                border:     "1px solid var(--border)",
                boxShadow:  "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <p
                className="text-[13px] font-semibold tracking-[0.1em] uppercase mb-3"
                style={{ color: "var(--text-3)" }}
              >
                Diagnose
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-[16px] font-light"
                  style={{ color: "var(--text-3)" }}
                >
                  ab
                </span>
                <span
                  style={{
                    fontSize:      "clamp(3rem, 8vw, 5.5rem)",
                    fontWeight:    800,
                    letterSpacing: "-0.04em",
                    lineHeight:    1,
                    color:         "var(--text)",
                  }}
                >
                  39
                </span>
                <span
                  style={{
                    fontSize:      "clamp(1.5rem, 4vw, 2.5rem)",
                    fontWeight:    300,
                    letterSpacing: "-0.02em",
                    color:         "var(--text-2)",
                    alignSelf:     "flex-start",
                    paddingTop:    "0.4em",
                  }}
                >
                  ,90 €
                </span>
              </div>

              <div
                className="mt-5 pt-5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                  Wird bei erfolgter Reparatur
                  <br />vollständig angerechnet.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — points + CTA */}
          <div className="flex flex-col gap-8 flex-1 max-w-md">
            <motion.h2
              className="text-heading"
              style={{ color: "var(--text)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
            >
              Faire Preise.
              <br />
              <span style={{ color: "var(--text-3)", fontWeight: 300 }}>
                Keine Kompromisse.
              </span>
            </motion.h2>

            <div className="flex flex-col gap-4">
              {points.map((p, i) => (
                <motion.div
                  key={p}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: "easeOut" as const }}
                >
                  {/* Check */}
                  <div
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--accent-sub)", border: "1px solid var(--accent)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7.5L8 3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {p}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" as const }}
            >
              <a
                href="mailto:handyundpcservice@gmail.com?subject=Diagnose-Anfrage"
                className="inline-flex items-center gap-2 text-[15px] font-medium transition-colors duration-150 hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Diagnose anfragen →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
