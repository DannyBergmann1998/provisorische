"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Wrench, RefreshCw, ShoppingBag, Package,
  BarChart3, FileText, Settings, LogOut, Shield, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const navItems = [
  { href: "/admin",           label: "Übersicht",     icon: LayoutDashboard, end: true },
  { href: "/admin/users",     label: "Nutzer",         icon: Users },
  { href: "/admin/repairs",   label: "Reparaturen",   icon: Wrench },
  { href: "/admin/buybacks",  label: "Ankäufe",       icon: RefreshCw },
  { href: "/admin/orders",    label: "Bestellungen",  icon: ShoppingBag },
  { href: "/admin/products",  label: "Produkte",      icon: Package },
  { href: "/admin/analytics", label: "Statistiken",   icon: BarChart3 },
  { href: "/admin/invoices",  label: "Rechnungen",    icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href: string, end?: boolean) =>
    end ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-primary-400" />
          <span className="font-black text-white text-sm">Admin Panel</span>
        </div>
        <p className="text-xs text-slate-500">HandyUndPCService</p>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-purple-400">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, end }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(href, end)
                ? "bg-primary-600/20 text-primary-400 border border-primary-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-0.5 border-t border-slate-700/50 pt-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Settings size={17} />
          Nutzer-Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={17} />
          Abmelden
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white border border-slate-700"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-700/50 z-40 transition-transform duration-300",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Content />
      </aside>
    </>
  );
}
