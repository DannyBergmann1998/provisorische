"use client";

import { motion } from "framer-motion";
import { ClipboardList, Calculator, Wrench, CheckCircle } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

const steps = [
  {
    icon:  ClipboardList,
    step:  "01",
    title: "Anfrage stellen",
    desc:  "Wähle dein Gerät, beschreibe das Problem und erhalte sofort einen Kostenvoranschlag.",
  },
  {
    icon:  Calculator,
    step:  "02",
    title: "Preis bestätigen",
    desc:  "Wir prüfen das Gerät und informieren dich über den finalen Preis. Keine versteckten Kosten.",
  },
  {
    icon:  Wrench,
    step:  "03",
    title: "Reparatur",
    desc:  "Unser Techniker repariert dein Gerät professionell mit hochwertigen Ersatzteilen.",
  },
  {
    icon:  CheckCircle,
    step:  "04",
    title: "Fertig!",
    desc:  "Du wirst benachrichtigt, wenn dein Gerät fertig ist. Abholung oder Versand möglich.",
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            So einfach geht's
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            In 4 Schritten zur Lösung
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gray-300 dark:bg-gray-700" />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <StaggerItem key={step}>
                <motion.div className="text-center relative">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-subtle dark:shadow-dark-card mx-auto">
                    <Icon size={24} className="text-white dark:text-black" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-[#0A0A0A] border-2 border-black dark:border-white rounded-full text-xs font-bold text-black dark:text-white flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
