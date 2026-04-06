"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const goto = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06]"
          : ""
      }`}
      style={{
        background: scrolled ? "rgba(10,10,10,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo lockup */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 relative flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Handy & PC Service Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-[#F5F5F7] group-hover:text-white transition-colors">
            Handy & PC Service
          </span>
        </button>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Leistungen", id: "leistungen" },
            { label: "Formular",   id: "download"   },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => goto(item.id)}
              className="text-[13px] text-[#86868B] hover:text-[#F5F5F7] transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => goto("kontakt")}
            className="ml-1 px-4 py-[7px] text-[13px] font-medium rounded-full border border-white/[0.14] text-[#F5F5F7] hover:bg-white/[0.07] transition-colors duration-150"
          >
            Kontakt
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden relative w-7 h-5 flex flex-col justify-between"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          <span
            className={`block h-px bg-[#F5F5F7] rounded transition-all duration-250 origin-left ${
              mobileOpen ? "rotate-[42deg] translate-y-px" : "w-full"
            }`}
          />
          <span
            className={`block h-px bg-[#F5F5F7] rounded transition-all duration-200 ${
              mobileOpen ? "opacity-0 scale-x-0" : "w-4/5"
            }`}
          />
          <span
            className={`block h-px bg-[#F5F5F7] rounded transition-all duration-250 origin-left ${
              mobileOpen ? "-rotate-[42deg] -translate-y-px" : "w-3/5"
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/[0.06]"
            style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col px-6 py-5 gap-1">
              {[
                { label: "Leistungen",  id: "leistungen" },
                { label: "Formular",    id: "download"   },
                { label: "Kontakt",     id: "kontakt"    },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => goto(item.id)}
                  className="py-3 text-[15px] text-[#A1A1AA] hover:text-white text-left border-b border-white/[0.05] last:border-0 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
