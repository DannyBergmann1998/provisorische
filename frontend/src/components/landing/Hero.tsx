"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, RefreshCw, Store, Shield, Clock, Star } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Professional iPhone Repair Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&h=1080&fit=crop&q=80')`,
        }}
      />

      {/* Dark overlay for better text readability (stronger for image clarity) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/55 to-black/60 dark:from-black/70 dark:via-black/75 dark:to-black/80" />

      {/* Main content */}
      <div className="w-full relative z-20">
        {/* Hero text section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-6 text-center mb-20"
        >
          {/* Minimal badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block mb-8"
          >
            <span className="text-sm font-medium text-white dark:text-gray-200">
              Ihr lokaler Reparaturservice
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white dark:text-gray-50 leading-tight mb-8 text-balance"
          >
            Handy & PC Reparatur – schnell, professionell & fair
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-100 dark:text-[#E0E0E0] max-w-2xl mx-auto mb-12 text-balance leading-relaxed"
          >
            Reparaturen, Ankauf und generalüberholte Geräte – alles aus einer Hand.
            Kostenlose Diagnose und ehrliche Preise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/repair"
                className="px-8 py-3 bg-white dark:bg-white text-black dark:text-black rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Reparatur anfragen
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/buyback"
                className="px-8 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-md text-white dark:text-white border border-white/30 dark:border-white/20 rounded-full font-medium hover:bg-white/30 dark:hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
              >
                Gerät verkaufen
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-100 dark:text-[#E0E0E0]"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-white dark:text-[#A0A0A0]" />
              <span>6 Monate Garantie</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-white dark:text-[#A0A0A0]" />
              <span>Express-Reparatur möglich</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-white dark:text-[#A0A0A0]" />
              <span>4.9 / 5 (200+ Kunden)</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Service cards - minimal design */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              icon: Wrench,
              title: "Fachgerechte Reparatur",
              desc: "Display, Akku, Wasserschäden. Kostenloser Kostenvoranschlag.",
              href: "/repair",
            },
            {
              icon: RefreshCw,
              title: "Fairer Ankauf",
              desc: "Sofortbewertung. Transparente Preise, schnelle Auszahlung.",
              href: "/buyback",
            },
            {
              icon: Store,
              title: "Geprüfte Geräte",
              desc: "Generalüberholte Elektronik. Mit 6 Monaten Garantie.",
              href: "/shop",
            },
          ].map(({ icon: Icon, title, desc, href }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href={href}
                  className="group p-6 rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#333333] hover:border-gray-300 dark:hover:border-[#404040] hover:shadow-card dark:hover:shadow-lg transition-all block"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#151515] flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-[#262626] transition-colors">
                    <Icon size={20} className="text-black dark:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-[#A0A0A0] text-sm leading-relaxed mb-4">
                    {desc}
                  </p>
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Mehr erfahren
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
