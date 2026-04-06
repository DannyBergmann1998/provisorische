"use client";

import { motion } from "framer-motion";

type Service = {
  id:    string;
  title: string;
  sub:   string;
  body:  string;
  area:  string;
};

const services: Service[] = [
  {
    id:    "smartphone",
    title: "Smartphone",
    sub:   "Reparatur",
    body:  "Display, Akku, Kamera, Lautsprecher, Ladebuchse. Wir beheben alle gängigen Defekte — oft am selben Tag.",
    area:  "1 / 1 / 3 / 2", // row 1-3, col 1-2 → tall left card
  },
  {
    id:    "pc",
    title: "PC & Laptop",
    sub:   "Reparatur",
    body:  "Hardware-Defekte, Systemprobleme, Viren, Datenverlust. Wir kümmern uns.",
    area:  "1 / 2 / 2 / 3",
  },
  {
    id:    "display",
    title: "Display &",
    sub:   "Akkutausch",
    body:  "Original-Qualität oder zertifizierte Ersatzteile. Klar kommuniziert, bevor wir beginnen.",
    area:  "1 / 3 / 2 / 4",
  },
  {
    id:    "diagnose",
    title: "Fehler-",
    sub:   "diagnose",
    body:  "Kostenlose und sorgfältige Analyse. Wir finden die Ursache, bevor wir mit der Reparatur beginnen.",
    area:  "2 / 2 / 3 / 4", // bottom-right, spans 2 cols → wide
  },
];

const cardBase = {
  position: "relative" as const,
  overflow: "hidden" as const,
  borderRadius: "16px",
  border: "1px solid var(--border)",
  padding: "28px",
  transition: "border-color 0.2s, background 0.2s",
  cursor: "default",
};

export function Services() {
  return (
    <section id="leistungen" className="py-24 lg:py-32 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
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

        {/* Bento grid — desktop asymmetric, mobile stacked */}
        <div
          className="hidden lg:grid gap-3"
          style={{ gridTemplateColumns: "1.35fr 1fr 1fr", gridTemplateRows: "auto auto" }}
        >
          {services.map((s, i) => (
            <BentoCard key={s.id} service={s} index={i} gridArea={s.area} />
          ))}
        </div>

        {/* Mobile: stack */}
        <div className="lg:hidden flex flex-col gap-3">
          {services.map((s, i) => (
            <BentoCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ service, index, gridArea }: { service: Service; index: number; gridArea?: string }) {
  const isFeatured = service.id === "smartphone";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" as const }}
      style={{
        ...cardBase,
        gridArea,
        background: isFeatured ? "var(--surface-2)" : "var(--surface)",
        minHeight: isFeatured ? "240px" : undefined,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)";
        (e.currentTarget as HTMLElement).style.background  = "var(--surface-3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.background  = isFeatured ? "var(--surface-2)" : "var(--surface)";
      }}
    >
      {/* Featured glow */}
      {isFeatured && (
        <div
          aria-hidden
          className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Card number */}
      <p
        className="text-[11px] font-mono mb-6"
        style={{ color: "var(--text-3)" }}
      >
        0{index + 1}
      </p>

      {/* Title */}
      <div className="mb-4">
        <h3
          className={`font-bold leading-tight tracking-tight ${isFeatured ? "text-[28px]" : "text-[20px]"}`}
          style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
        >
          {service.title}
        </h3>
        <h3
          className={`font-light leading-tight tracking-tight ${isFeatured ? "text-[28px]" : "text-[20px]"}`}
          style={{ color: "var(--text-3)", letterSpacing: "-0.02em" }}
        >
          {service.sub}
        </h3>
      </div>

      {/* Body */}
      <p
        className="text-[14px] leading-relaxed"
        style={{ color: "var(--text-2)" }}
      >
        {service.body}
      </p>
    </motion.div>
  );
}
