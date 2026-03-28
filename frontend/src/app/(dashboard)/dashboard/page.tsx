"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Wrench, ShoppingBag, RefreshCw, FileText, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const STATUS_LABELS: Record<string, string> = {
  PENDING:       "Ausstehend",
  RECEIVED:      "Eingegangen",
  IN_PROGRESS:   "In Bearbeitung",
  WAITING_PARTS: "Wartet auf Teile",
  DONE:          "Abgeschlossen",
  CANCELLED:     "Storniert",
  PAID:          "Bezahlt",
  DELIVERED:     "Geliefert",
  ACCEPTED:      "Akzeptiert",
  REJECTED:      "Abgelehnt",
};

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: repairsData } = useQuery({
    queryKey: ["repairs"],
    queryFn:  () => fetch("/api/repairs?limit=3").then((r) => r.json()).then((r) => r.data),
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn:  () => fetch("/api/shop/orders?limit=3").then((r) => r.json()).then((r) => r.data),
  });

  const { data: buybacksData } = useQuery({
    queryKey: ["buybacks"],
    queryFn:  () => fetch("/api/buybacks?limit=3").then((r) => r.json()).then((r) => r.data),
  });

  const repairs  = repairsData?.data  ?? [];
  const orders   = ordersData?.data   ?? [];
  const buybacks = buybacksData?.data ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white mb-1">
          Guten Tag, {user?.name?.split(" ")[0] ?? "Nutzer"}! 👋
        </h1>
        <p className="text-slate-400">Hier ist eine Übersicht deiner Aktivitäten.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/repair" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <Wrench size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Reparatur anfragen</p>
            <p className="text-slate-500 text-xs">Neuen Auftrag erstellen</p>
          </div>
        </Link>
        <Link href="/buyback" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <RefreshCw size={22} className="text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Gerät verkaufen</p>
            <p className="text-slate-500 text-xs">Sofortpreise erhalten</p>
          </div>
        </Link>
        <Link href="/shop" className="card-hover flex items-center gap-4 group">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <ShoppingBag size={22} className="text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Shop besuchen</p>
            <p className="text-slate-500 text-xs">Günstige Angebote</p>
          </div>
        </Link>
      </div>

      {/* Recent repairs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench size={18} className="text-blue-400" />
            Reparaturen
          </h2>
          <Link href="/dashboard/repairs" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
            Alle ansehen <ArrowRight size={14} />
          </Link>
        </div>
        {repairs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Wrench size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Keine Reparaturen vorhanden.</p>
            <Link href="/repair" className="btn-primary inline-flex items-center gap-2 mt-3 text-sm !py-2 !px-4">
              <Plus size={14} />
              Neue Anfrage
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {repairs.map((r: {id: string; deviceModel: string; issue: string; status: string; createdAt: string; estimatedPrice?: number}) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.deviceModel} – {r.issue}</p>
                  <p className="text-xs text-slate-500">{formatDate(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  {r.estimatedPrice && (
                    <span className="text-xs text-slate-400 hidden sm:block">
                      ca. {formatPrice(r.estimatedPrice)}
                    </span>
                  )}
                  <Badge status={r.status}>{STATUS_LABELS[r.status] ?? r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag size={18} className="text-green-400" />
            Bestellungen
          </h2>
          <Link href="/dashboard/orders" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
            Alle ansehen <ArrowRight size={14} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Noch keine Bestellungen.</p>
            <Link href="/shop" className="text-primary-400 text-sm mt-2 inline-block hover:underline">Shop entdecken</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o: {id: string; totalAmount: number; status: string; createdAt: string; items: {product: {name: string}}[]}) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {o.items?.[0]?.product?.name ?? "Bestellung"} {o.items?.length > 1 ? `+${o.items.length - 1}` : ""}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-sm font-semibold text-white">{formatPrice(o.totalAmount)}</span>
                  <Badge status={o.status}>{STATUS_LABELS[o.status] ?? o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent buybacks */}
      {buybacks.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw size={18} className="text-orange-400" />
              Ankäufe
            </h2>
            <Link href="/dashboard/buybacks" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Alle ansehen <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {buybacks.map((b: {id: string; deviceModel: string; offeredPrice: number; status: string; createdAt: string}) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <div>
                  <p className="text-sm font-medium text-white">{b.deviceModel}</p>
                  <p className="text-xs text-slate-500">{formatDate(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className="text-sm font-semibold text-orange-400">{formatPrice(b.offeredPrice)}</span>
                  <Badge status={b.status}>{STATUS_LABELS[b.status] ?? b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
