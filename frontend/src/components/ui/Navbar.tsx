"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { DarkModeToggle } from "./DarkModeToggle";

const navLinks = [
  { href: "/repair",  label: "Reparatur" },
  { href: "/buyback", label: "Ankauf" },
  { href: "/shop",    label: "Shop" },
];

export function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#262626] shadow-subtle dark:shadow-dark-card"
          : "bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-md border-b border-gray-100 dark:border-[#262626]"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            aria-label="Handy & PC Service - Startseite"
          >
            <img
              src="/logo.png"
              alt="Handy & PC Service Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
              loading="eager"
            />
            <div className="leading-none hidden sm:block">
              <div className="font-bold text-black dark:text-white text-sm md:text-base">
                Handy & PC
              </div>
              <div className="text-xs text-gray-600 dark:text-[#A0A0A0]">
                Service
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-black dark:text-white"
                    : "text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#262626] border-t border-gray-100 dark:border-[#262626]">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors",
                  pathname === href
                    ? "bg-gray-100 dark:bg-[#151515] text-black dark:text-white"
                    : "text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#262626]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
