"use client";

import { motion } from "framer-motion";

const items = [
  {
    n:     "01",
    title: "Schnelle\nBearbeitung",
    body:  "Viele Reparaturen erledigen wir noch am selben Tag.",
  },
  {
    n:     "02",
    title: "Transparente\nPreise",
    body:  "Klares Angebot vor jeder Reparatur. Keine Überraschungen.",
  },
  {
    n:     "03",
    title: "Persönlicher\nService",
    body:  "Direkter Ansprechpartner, keine anonymen Callcenter.",
  },
  {
    n:     "04",
    title: "Erfahrung &\nZuverlässigkeit",
    body:  "Hunderte erfolgreiche Reparaturen. Garantie auf Ersatzteile.",
  },
];

export function Trust() {
  return (
    <section id="vorteile" className="py-24 lg:py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="text-label mb-3" style={{ color: "var(--accent)" }}>
            Warum wir
          </p>
          <h2 className="text-heading" style={{ color: "var(--text)" }}>
            Ihr Gerät.
            <br />
            <span style={{ color: "var(--text-3)", fontWeight: 300 }}>Unsere Verantwortung.</span>
          </h2>
        </motion.div>

        {/* Grid — 4 cols on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "var(--border)" }}>
          {items.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="p-8 flex flex-col"
              style={{ background: "var(--surface)" }}
            >
              {/* Number */}
              <p
                className="text-[11px] font-mono mb-8"
                style={{ color: "var(--text-3)" }}
              >
                {item.n}
              </p>

              {/* Title — multi-line via whitespace */}
              <h3
                className="text-[20px] font-bold leading-snug mb-4 whitespace-pre-line"
                style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
              >
                {item.title}
              </h3>

              {/* Divider */}
              <div className="w-8 h-px mb-4" style={{ background: "var(--border-2)" }} />

              {/* Body */}
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
