"use client";

import { motion } from "framer-motion";
import { Smartphone, Monitor, Battery, Search } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Smartphone Reparatur",
    description:
      "Display, Kamera, Lautsprecher, Ladebuchse – wir beheben alle gängigen Schäden schnell und fachgerecht.",
  },
  {
    icon: Monitor,
    title: "PC & Laptop Reparatur",
    description:
      "Ob Softwareproblem, defekte Hardware oder Systemausfall – wir bringen Ihren Computer zuverlässig zum Laufen.",
  },
  {
    icon: Battery,
    title: "Display- & Akkutausch",
    description:
      "Original-Qualität oder Premium-Ersatzteile. Schnelle Austausche – oft noch am selben Tag.",
  },
  {
    icon: Search,
    title: "Fehlerdiagnose",
    description:
      "Kostenlose und sorgfältige Diagnose. Wir finden die Ursache, bevor wir mit der Reparatur beginnen.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Services() {
  return (
    <section id="leistungen" className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0071e3] mb-3">
            Unsere Leistungen
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-[#1d1d1f] leading-tight">
            Alles aus einer Hand.
          </h2>
          <p className="mt-4 text-[17px] text-[#6e6e73] font-light max-w-md mx-auto leading-relaxed">
            Von der Diagnose bis zur fertigen Reparatur – schnell, sauber, zuverlässig.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group bg-[#f5f5f7] hover:bg-white rounded-2xl p-7 border border-transparent hover:border-black/[0.08] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-default"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-white group-hover:bg-[#f0f7ff] border border-black/[0.06] flex items-center justify-center mb-5 transition-colors duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <Icon className="w-5 h-5 text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors duration-300" strokeWidth={1.8} />
                </div>

                {/* Text */}
                <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2 leading-snug">
                  {service.title}
                </h3>
                <p className="text-[14px] text-[#6e6e73] leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
