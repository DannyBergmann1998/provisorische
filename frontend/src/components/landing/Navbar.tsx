"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] hover:text-[#0071e3] transition-colors duration-200"
        >
          Handy & PC Service
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo("leistungen")}
            className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors duration-200"
          >
            Leistungen
          </button>
          <button
            onClick={() => scrollTo("vorteile")}
            className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors duration-200"
          >
            Warum wir
          </button>
          <button
            onClick={() => scrollTo("kontakt")}
            className="ml-2 px-4 py-2 text-sm font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-[#0071e3] transition-colors duration-200"
          >
            Kontakt
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü öffnen"
        >
          <span className={`block w-5 h-0.5 bg-[#1d1d1f] transition-all duration-200 origin-center ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#1d1d1f] transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#1d1d1f] transition-all duration-200 origin-center ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/[0.06] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              <button onClick={() => scrollTo("leistungen")} className="text-sm text-[#1d1d1f] py-2 text-left">Leistungen</button>
              <button onClick={() => scrollTo("vorteile")} className="text-sm text-[#1d1d1f] py-2 text-left">Warum wir</button>
              <button
                onClick={() => scrollTo("kontakt")}
                className="mt-1 px-4 py-2.5 text-sm font-medium text-white bg-[#1d1d1f] rounded-full text-center hover:bg-[#0071e3] transition-colors duration-200"
              >
                Kontakt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
