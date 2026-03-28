"use client";

import { motion } from "framer-motion";
import { Shield, Award, Clock, ThumbsUp, Users, Repeat } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

const stats = [
  { value: "2.000+", label: "Reparaturen",    icon: Repeat },
  { value: "98%",    label: "Zufriedenheit",  icon: ThumbsUp },
  { value: "5+",     label: "Jahre Erfahrung", icon: Award },
  { value: "500+",   label: "Stammkunden",    icon: Users },
];

const trustPoints = [
  {
    icon:  Shield,
    title: "6 Monate Garantie",
    desc:  "Auf alle Reparaturen geben wir 6 Monate Garantie. Qualität, die überzeugt.",
  },
  {
    icon:  Award,
    title: "Erfahrener Fachbetrieb",
    desc:  "Mit über 5 Jahren Erfahrung und ausgebildetem Personal für alle gängigen Geräte und Marken.",
  },
  {
    icon:  Clock,
    title: "Schnelle Abwicklung",
    desc:  "Viele Reparaturen werden noch am selben Tag abgeschlossen. Express-Service verfügbar.",
  },
  {
    icon:  ThumbsUp,
    title: "Kostenloser KVA",
    desc:  "Du erhältst einen kostenlosen Kostenvoranschlag. Keine Reparatur ohne deine Zustimmung.",
  },
];

export function Trust() {
  return (
    <section className="section bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map(({ value, label, icon: Icon }) => (
            <StaggerItem key={label}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card text-center group"
              >
              <div className="w-10 h-10 bg-gray-100 dark:bg-[#151515] rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 dark:group-hover:bg-[#262626] transition-colors">
                <Icon size={20} className="text-black dark:text-white" />
              </div>
              <p className="text-3xl md:text-4xl font-semibold text-black dark:text-white mb-1">{value}</p>
              <p className="text-gray-600 dark:text-[#A0A0A0] text-sm">{label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trust points */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            Warum wir?
          </h2>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-xl mx-auto">
            Vertrauen ist alles – deshalb setzen wir auf Transparenz, Qualität und faire Preise.
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustPoints.map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card-hover flex gap-5"
              >
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-[#262626] transition-colors">
                <Icon size={20} className="text-black dark:text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-sm leading-relaxed">{desc}</p>
              </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
