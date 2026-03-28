"use client";

import { motion } from "framer-motion";
import { Smartphone, Monitor, Gamepad2, Tablet, Battery, Zap, Droplets, Camera, HardDrive, Wifi } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

const services = [
  {
    icon:     Smartphone,
    title:    "Handy-Reparatur",
    repairs:  ["Display & Touchscreen", "Akku-Tausch", "Kamera", "Ladeanschluss", "Wasserschaden", "Software-Probleme"],
    brands:   "iPhone, Samsung, Huawei, Xiaomi & mehr",
    price:    "ab 29 €",
  },
  {
    icon:     Monitor,
    title:    "PC & Laptop",
    repairs:  ["Display-Tausch", "Viren & Malware", "Windows-Neuinstallation", "Datenrettung", "Lüfter & Kühlung", "Mainboard"],
    brands:   "Dell, HP, Lenovo, ASUS, Apple & mehr",
    price:    "ab 49 €",
  },
  {
    icon:     Gamepad2,
    title:    "Konsolen",
    repairs:  ["HDMI-Port", "Disc-Laufwerk", "Überhitzung", "Controller", "Software-Update", "Mainboard"],
    brands:   "PlayStation, Xbox, Nintendo Switch",
    price:    "ab 39 €",
  },
  {
    icon:     Tablet,
    title:    "Tablets",
    repairs:  ["Display-Tausch", "Akku-Tausch", "Lautsprecher", "Ladebuchse", "Kamera", "Gehäuse"],
    brands:   "iPad, Samsung Tab, Huawei MatePad",
    price:    "ab 39 €",
  },
];

const features = [
  { icon: Zap,       label: "Express-Service",  desc: "Oft fertig am selben Tag" },
  { icon: Battery,   label: "Originale Teile",   desc: "Hochwertige Ersatzteile" },
  { icon: Droplets,  label: "Wasserschäden",     desc: "Professionelle Behandlung" },
  { icon: Camera,    label: "Kamera-Reparatur",  desc: "Für alle Modelle" },
  { icon: HardDrive, label: "Datenrettung",      desc: "Auch bei defekten Geräten" },
  { icon: Wifi,      label: "Software-Service",  desc: "Updates, Virenschutz" },
];

export function Services() {
  return (
    <section id="services" className="section bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Unsere Leistungen
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            Was wir reparieren
          </h2>
          <p className="text-gray-600 dark:text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Professionelle Reparatur für alle gängigen Geräte – schnell, günstig und mit Garantie.
          </p>
        </div>

        {/* Service cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map(({ icon: Icon, title, repairs, brands, price }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="card-hover group"
              >
              <div className="w-10 h-10 bg-gray-100 dark:bg-[#1A1A1A] rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-[#262626] transition-colors">
                <Icon size={20} className="text-black dark:text-white" />
              </div>
              <h3 className="font-semibold text-black dark:text-white text-base mb-3">{title}</h3>
              <ul className="space-y-1.5 mb-4">
                {repairs.map((r) => (
                  <li key={r} className="text-gray-600 dark:text-[#A0A0A0] text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-gray-200 dark:border-[#333333]">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{brands}</p>
                <p className="text-sm font-semibold text-black dark:text-white">{price}</p>
              </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Features grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <StaggerItem key={label}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="card text-center group hover:border-gray-300 dark:hover:border-[#404040] transition-colors"
              >
              <div className="w-10 h-10 bg-gray-100 dark:bg-[#1A1A1A] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 dark:group-hover:bg-[#262626] transition-colors">
                <Icon size={18} className="text-black dark:text-white" />
              </div>
              <h4 className="text-black dark:text-white text-sm font-semibold mb-1">{label}</h4>
              <p className="text-gray-500 dark:text-gray-500 text-xs">{desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
