"use client";

import { motion } from "framer-motion";

export function Download() {
  return (
    <section id="download" className="py-24 lg:py-32 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

          {/* Left — text */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-label mb-4" style={{ color: "var(--accent)" }}>
              Reparaturauftrag
            </p>
            <h2 className="text-heading mb-5" style={{ color: "var(--text)" }}>
              Formular
              <br />
              <span style={{ color: "var(--text-3)", fontWeight: 300 }}>herunterladen.</span>
            </h2>
            <p className="text-[16px] font-light leading-relaxed" style={{ color: "var(--text-2)" }}>
              Laden Sie das Auftragsformular herunter, füllen Sie es aus und
              legen Sie es Ihrem Paket bei. Kein Konto, kein Formular online.
            </p>

            {/* Steps */}
            <div className="mt-8 space-y-3">
              {[
                "Formular herunterladen",
                "Im Browser öffnen und als PDF speichern",
                "Ausfüllen & dem Paket beilegen",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className="text-[11px] font-mono w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      color:      "var(--text-3)",
                      background: "var(--surface-2)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — download card */}
          <motion.div
            className="w-full lg:w-auto lg:min-w-[320px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          >
            <div
              className="rounded-2xl p-7 flex flex-col gap-6"
              style={{
                background: "var(--surface)",
                border:     "1px solid var(--border)",
                boxShadow:  "0 16px 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* File card */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: "var(--surface-2)",
                  border:     "1px solid var(--border)",
                }}
              >
                {/* PDF icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(10,132,255,0.1)", border: "1px solid rgba(10,132,255,0.2)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 2h7l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2v4h4" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11h6M7 14h4" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
                    Reparaturauftrag
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
                    Handy &amp; PC Service · HTML/PDF
                  </p>
                </div>
              </div>

              {/* Download button */}
              <a
                href="/auftrag.html"
                download="Reparaturauftrag_Handy_PC_Service.html"
                className="group flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "var(--accent)",
                  boxShadow:  "0 0 28px rgba(10,132,255,0.18), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {/* Download arrow icon */}
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="group-hover:translate-y-0.5 transition-transform duration-200"
                >
                  <path d="M8 2v8M8 10L5 7M8 10L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 13h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Auftragsformular herunterladen
              </a>

              {/* Note */}
              <p className="text-[11px] text-center leading-relaxed" style={{ color: "var(--text-3)" }}>
                Datei im Browser öffnen &rarr; „Als PDF speichern"
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
