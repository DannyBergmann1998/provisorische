"use client";

import { motion } from "framer-motion";

export function Notice() {
  return (
    <section className="py-16 px-6" style={{ background: "var(--bg)" }}>
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
      >
        <div
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: [
              "0 0 0 1px rgba(10,132,255,0.08)",
              "0 24px 48px rgba(0,0,0,0.4)",
              "inset 0 0 60px rgba(10,132,255,0.03)",
            ].join(", "),
          }}
        >
          {/* Top accent line */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(10,132,255,0.6), transparent)" }}
          />

          {/* Status dot + label */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="inline-flex w-2 h-2 rounded-full"
              style={{ background: "#FF9F0A", boxShadow: "0 0 8px rgba(255,159,10,0.6)" }}
            />
            <span className="text-label" style={{ color: "var(--text-3)" }}>
              Hinweis
            </span>
          </div>

          {/* Main text */}
          <p
            className="text-[17px] font-medium leading-relaxed mb-2"
            style={{ color: "var(--text)" }}
          >
            Unsere Haupt-Serviceseite befindet sich derzeit in Bearbeitung.
          </p>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
            Reparaturaufträge sowie Fragen zu Reparaturen können Sie gerne per E-Mail stellen:
          </p>

          {/* Email link — styled as a row */}
          <a
            href="mailto:handyundpcservice@gmail.com"
            className="group flex items-center justify-between p-4 rounded-xl transition-all duration-200"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,132,255,0.3)";
              (e.currentTarget as HTMLElement).style.background = "var(--surface-3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
            }}
          >
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-3)" }}>
                E-Mail
              </p>
              <p className="text-[15px] font-medium" style={{ color: "var(--accent)" }}>
                handyundpcservice@gmail.com
              </p>
            </div>
            <span
              className="text-[20px] translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
              style={{ color: "var(--accent)" }}
            >
              →
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
