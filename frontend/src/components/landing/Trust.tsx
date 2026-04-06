"use client";

import { motion } from "framer-motion";
import { Zap, EuroIcon, UserCheck, ShieldCheck } from "lucide-react";

const advantages = [
  {
    icon: Zap,
    title: "Schnelle Bearbeitung",
    description: "Viele Reparaturen erledigen wir noch am selben Tag. Keine langen Wartezeiten.",
  },
  {
    icon: EuroIcon,
    title: "Transparente Preise",
    description: "Klare Festpreise ohne versteckte Kosten. Angebot immer vor der Reparatur.",
  },
  {
    icon: UserCheck,
    title: "Persönlicher Service",
    description: "Direkter Ansprechpartner, keine anonymen Callcenter. Wir nehmen uns Zeit für Sie.",
  },
  {
    icon: ShieldCheck,
    title: "Erfahrung & Zuverlässigkeit",
    description: "Hunderte erfolgreiche Reparaturen. Qualität die überzeugt und Garantie auf Ersatzteile.",
  },
];

export function Trust() {
  return (
    <section id="vorteile" className="py-24 lg:py-32 px-6 bg-[#f5f5f7]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0071e3] mb-3">
            Warum wir
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">
            Ihr Gerät. Unsere Verantwortung.
          </h2>
          <p className="mt-4 text-[17px] text-[#6e6e73] font-light max-w-md mx-auto leading-relaxed">
            Wir behandeln jedes Gerät so, als wäre es unser eigenes.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                className="bg-white rounded-2xl p-6 border border-black/[0.05] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#0071e3]" strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-2 leading-snug">
                  {adv.title}
                </h3>
                <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
