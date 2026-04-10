"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

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
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:   scrolled ? "rgba(var(--bg-raw, 10,10,10), 0.72)" : "transparent",
        backdropFilter:       scrolled ? "blur(24px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(160%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 72%, transparent)" : "transparent",
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
          <span
            className="text-[14px] font-semibold tracking-tight transition-colors duration-200"
            style={{ color: "var(--text)" }}
          >
            Handy & PC Service
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {[
            { label: "Leistungen", id: "leistungen" },
            { label: "Preise",     id: "preise"     },
            { label: "Formular",   id: "download"   },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => goto(item.id)}
              className="text-[13px] transition-colors duration-150"
              style={{ color: "var(--text-3)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
            >
              {item.label}
            </button>
          ))}

          <ThemeToggle />

          <button
            onClick={() => goto("kontakt")}
            className="ml-1 px-4 py-[7px] text-[13px] font-medium rounded-full transition-all duration-150"
            style={{
              color:   "var(--text)",
              border:  "1px solid var(--border-2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--surface)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Kontakt
          </button>
        </div>

        {/* Mobile right group */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="relative w-7 h-5 flex flex-col justify-between"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            <span
              className="block h-px rounded transition-all duration-250 origin-left"
              style={{
                background: "var(--text)",
                width: "100%",
                transform: mobileOpen ? "rotate(42deg) translateY(1px)" : "none",
              }}
            />
            <span
              className="block h-px rounded transition-all duration-200"
              style={{
                background: "var(--text)",
                width: "80%",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px rounded transition-all duration-250 origin-left"
              style={{
                background: "var(--text)",
                width: "60%",
                transform: mobileOpen ? "rotate(-42deg) translateY(-1px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop:   "1px solid var(--border)",
              background:  "color-mix(in srgb, var(--bg) 92%, transparent)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col px-6 py-5 gap-1">
              {[
                { label: "Leistungen",  id: "leistungen" },
                { label: "Preise",      id: "preise"     },
                { label: "Formular",    id: "download"   },
                { label: "Kontakt",     id: "kontakt"    },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => goto(item.id)}
                  className="py-3 text-[15px] text-left transition-colors"
                  style={{
                    color:       "var(--text-2)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
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
