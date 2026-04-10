"use client";

import { motion } from "framer-motion";

type Category = {
  id:          string;
  icon:        React.ReactNode;
  title:       string;
  items?:      string[];
  note?:       string;
  premium?:    boolean;
};

// ── Icons (inline SVG — no library deps, precise control) ────────────────────

const IconPhone = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="14" height="24" rx="3" />
    <circle cx="14" cy="20.5" r="1" fill="currentColor" stroke="none"/>
    <line x1="11" y1="6" x2="17" y2="6"/>
  </svg>
);

const IconMonitor = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="24" height="16" rx="2" />
    <line x1="9" y1="24" x2="19" y2="24"/>
    <line x1="14" y1="20" x2="14" y2="24"/>
  </svg>
);

const IconGamepad = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h20l-2 10H6L4 10z"/>
    <line x1="10" y1="13" x2="10" y2="17"/>
    <line x1="8"  y1="15" x2="12" y2="15"/>
    <circle cx="19" cy="14" r="1" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="16" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const IconApple = () => (
  <svg width="26" height="28" viewBox="0 0 26 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6.5C18 6.5 20 4.5 18.5 2.5C17 2.5 15.5 3.5 14.5 5C13.5 3.5 11.5 2.5 10 2.5C8.5 4.5 10.5 6.5 10.5 6.5C7.5 7 5 9.5 5 13.5C5 18.5 7.5 25.5 11 25.5C12 25.5 13 24.5 14 24.5C15 24.5 16 25.5 17 25.5C20.5 25.5 23 18.5 23 13.5C23 9.5 20.5 7 18 6.5Z"/>
  </svg>
);

const categories: Category[] = [
  {
    id:    "handy",
    icon:  <IconPhone />,
    title: "Handy Reparatur",
    items: [
      "Display & Glas tauschen",
      "Akku wechseln",
      "Wasserschaden",
      "Ladebuchse reparieren",
    ],
  },
  {
    id:    "pc",
    icon:  <IconMonitor />,
    title: "PC & Laptop",
    items: [
      "Hardware-Reparatur",
      "Software & Virenentfernung",
      "Datenrettung",
      "Aufrüstung & Optimierung",
    ],
  },
  {
    id:    "konsolen",
    icon:  <IconGamepad />,
    title: "Konsolen",
    items: [
      "HDMI-Port Reparatur",
      "Lüfter & Kühlung",
      "Softwarefehler beheben",
      "Controller Reparatur",
    ],
  },
  {
    id:      "apple",
    icon:    <IconApple />,
    title:   "Apple Geräte",
    note:    "Wir reparieren Apple Geräte ausschließlich mit Originalteilen für maximale Qualität und Sicherheit.",
    premium: true,
  },
];

export function Services() {
  return (
    <section id="leistungen" className="py-24 lg:py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="text-label mb-3" style={{ color: "var(--accent)" }}>
            Unsere Leistungen
          </p>
          <h2 className="text-heading" style={{ color: "var(--text)" }}>
            Alles aus einer Hand.
          </h2>
        </motion.div>

        {/* 2 × 2 Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" as const }}
              className="group relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300"
              style={{
                background: cat.premium ? "var(--bg)" : "var(--bg)",
                border:     cat.premium
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                boxShadow: cat.premium
                  ? "0 0 40px var(--accent-sub)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = cat.premium ? "var(--accent)" : "var(--border-2)";
                el.style.boxShadow   = cat.premium
                  ? "0 0 48px var(--accent-sub)"
                  : "0 8px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = cat.premium ? "var(--accent)" : "var(--border)";
                el.style.boxShadow   = cat.premium ? "0 0 40px var(--accent-sub)" : "none";
              }}
            >
              {/* Premium badge */}
              {cat.premium && (
                <div
                  className="absolute top-6 right-6 text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full"
                  style={{
                    color:      "var(--accent)",
                    background: "var(--accent-sub)",
                    border:     "1px solid var(--accent)",
                  }}
                >
                  Original
                </div>
              )}

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
                style={{
                  background: cat.premium ? "var(--accent-sub)" : "var(--surface)",
                  border:     "1px solid var(--border)",
                  color:      cat.premium ? "var(--accent)" : "var(--text-2)",
                }}
              >
                {cat.icon}
              </div>

              {/* Title */}
              <h3
                className="text-[20px] font-bold"
                style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
              >
                {cat.title}
              </h3>

              {/* Items or note */}
              {cat.items ? (
                <ul className="flex flex-col gap-2.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: "var(--text-3)" }}
                      />
                      <span className="text-[14px]" style={{ color: "var(--text-2)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "var(--text-2)" }}
                >
                  {cat.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
