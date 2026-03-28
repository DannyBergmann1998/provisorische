"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { DarkModeToggle } from "./DarkModeToggle";

const navLinks = [
  { href: "/repair",  label: "Reparatur" },
  { href: "/buyback", label: "Ankauf" },
  { href: "/shop",    label: "Shop" },
];

export function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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
            {/* Official Logo Image (Simple img tag for best compatibility) */}
            <img
              src="/logo.png"
              alt="Handy & PC Service Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
              loading="eager"
            />

            {/* Text Branding (optional, can be hidden on mobile) */}
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
            {/* Dark Mode Toggle */}
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

            {/* User menu */}
            {!isLoading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={cn("transition-transform", userMenu && "rotate-180")} />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#333333] rounded-xl shadow-card dark:shadow-dark-card overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-100 dark:border-[#333333]">
                        <p className="text-xs text-gray-500 dark:text-[#A0A0A0]">Angemeldet als</p>
                        <p className="text-sm font-medium text-black dark:text-white truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                          <User size={14} />
                          Dashboard
                        </Link>
                        {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                          <Link href="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                            <Wrench size={14} />
                            Admin-Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                          <LogOut size={14} />
                          Abmelden
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className="px-4 py-2 rounded-full text-sm text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium">
                    Anmelden
                  </Link>
                  <Link href="/register" className="px-4 py-2 rounded-full text-sm bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors font-medium">
                    Registrieren
                  </Link>
                </div>
              )
            )}

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
            {!user && (
              <div className="pt-3 border-t border-gray-100 dark:border-[#262626] flex flex-col gap-2">
                <Link href="/login"    className="text-center text-sm py-2.5 text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#262626] rounded-lg transition-colors font-medium">Anmelden</Link>
                <Link href="/register" className="text-center text-sm py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 rounded-lg transition-colors font-medium">Registrieren</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
