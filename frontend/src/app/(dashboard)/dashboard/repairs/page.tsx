"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Wrench, Plus, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING:       "Ausstehend",
  RECEIVED:      "Eingegangen",
  IN_PROGRESS:   "In Bearbeitung",
  WAITING_PARTS: "Wartet auf Teile",
  DONE:          "Abgeschlossen",
  CANCELLED:     "Storniert",
};

export default function DashboardRepairsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["repairs", page],
    queryFn:  () =>
      fetch(`/api/repairs?page=${page}&limit=10`)
        .then((r) => r.json())
        .then((r) => r.data),
  });

  const repairs    = data?.data      ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Meine Reparaturen</h1>
          <p className="text-slate-400 text-sm">Alle deine Reparaturaufträge im Überblick.</p>
        </div>
        <Link href="/repair" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Neue Anfrage
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : repairs.length === 0 ? (
        <div className="card text-center py-12">
          <Wrench size={48} className="mx-auto mb-4 text-slate-700" />
          <p className="text-slate-400 font-medium mb-2">Keine Reparaturen vorhanden</p>
          <Link href="/repair" className="btn-primary inline-flex items-center gap-2 mt-2 text-sm">
            <Plus size={14} />
            Erste Anfrage stellen
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {repairs.map((r: {
            id: string;
            deviceType: string;
            deviceModel: string;
            issue: string;
            status: string;
            estimatedPrice?: number;
            finalPrice?: number;
            adminNotes?: string;
            createdAt: string;
            updatedAt: string;
            invoice?: { id: string; pdfUrl?: string };
          }) => (
            <div key={r.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{r.deviceModel}</p>
                    <p className="text-slate-400 text-sm">{r.issue}</p>
                    <p className="text-slate-600 text-xs mt-1">
                      Erstellt: {formatDate(r.createdAt)} · Aktualisiert: {formatDate(r.updatedAt)}
                    </p>
                    {r.adminNotes && (
                      <p className="text-blue-400 text-xs mt-1 bg-blue-500/10 px-2 py-1 rounded-lg inline-block">
                        Techniker: {r.adminNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {(r.finalPrice ?? r.estimatedPrice) && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{r.finalPrice ? "Endpreis" : "Schätzung"}</p>
                      <p className={`font-bold text-sm ${r.finalPrice ? "text-green-400" : "text-slate-300"}`}>
                        {formatPrice(r.finalPrice ?? r.estimatedPrice ?? 0)}
                      </p>
                    </div>
                  )}
                  <Badge status={r.status}>{STATUS_LABELS[r.status] ?? r.status}</Badge>
                  {r.invoice && (
                    <a
                      href={`/api/admin/invoices/${r.invoice.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-primary-400 transition-colors p-1.5 rounded-lg hover:bg-primary-500/10"
                      title="Rechnung herunterladen"
                    >
                      <FileText size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50">Zurück</button>
          <span className="flex items-center text-sm text-slate-400 px-4">Seite {page} von {pagination.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50">Weiter</button>
        </div>
      )}
    </div>
  );
}
