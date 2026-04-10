"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const [dark, setDark]       = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
      style={{
        color:      "var(--text-2)",
        background: "transparent",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-2)")}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          /* Sun — switch to light */
          <motion.svg
            key="sun"
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0,   opacity: 1 }}
            exit={{    rotate: 30,  opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1"  x2="12" y2="3"  />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1"  y1="12" x2="3"  y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
          </motion.svg>
        ) : (
          /* Moon — switch to dark */
          <motion.svg
            key="moon"
            initial={{ rotate: 30,  opacity: 0 }}
            animate={{ rotate: 0,   opacity: 1 }}
            exit={{    rotate: -30, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
