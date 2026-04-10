"use client";

import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 lg:py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center"
          style={{
            background: "var(--bg)",
            border:     "1px solid var(--border)",
            boxShadow:  "0 32px 80px rgba(0,0,0,0.2)",
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" as const }}
        >
          {/* Background accent glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 110%, var(--accent-glow) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10">
            <p className="text-label mb-6" style={{ color: "var(--accent)" }}>
              Bereit?
            </p>

            <h2
              className="mb-4 mx-auto"
              style={{
                fontSize:      "clamp(2rem, 6vw, 4rem)",
                fontWeight:    800,
                letterSpacing: "-0.03em",
                lineHeight:    1.05,
                color:         "var(--text)",
                maxWidth:      "600px",
              }}
            >
              Lass dein Gerät
              <br />
              <span style={{ fontWeight: 200, color: "var(--text-3)" }}>
                professionell prüfen.
              </span>
            </h2>

            <p
              className="mb-10 mx-auto"
              style={{
                fontSize:  "clamp(1rem, 2vw, 1.1rem)",
                fontWeight: 300,
                lineHeight: 1.7,
                color:     "var(--text-2)",
                maxWidth:  "400px",
              }}
            >
              Wir analysieren das Problem und geben Ihnen ein
              transparentes Angebot — ohne Verpflichtung.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:handyundpcservice@gmail.com?subject=Reparaturanfrage"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "var(--accent)",
                  boxShadow:  "0 0 32px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                Jetzt Termin sichern
              </a>
              <a
                href="/auftrag.html"
                download="Reparaturauftrag_Handy_PC_Service.html"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[15px] font-medium transition-all duration-200"
                style={{
                  color:  "var(--text-2)",
                  border: "1px solid var(--border-2)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                Formular herunterladen
              </a>
            </div>

            <p className="mt-6 text-[12px]" style={{ color: "var(--text-3)" }}>
              Antwort innerhalb von 24 Stunden &nbsp;·&nbsp; Keine Verpflichtung
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
