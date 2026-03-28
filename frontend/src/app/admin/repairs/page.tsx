"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, ChevronDown, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils";

const REPAIR_STATUSES = [
  { value: "",              label: "Alle" },
  { value: "PENDING",       label: "Ausstehend" },
  { value: "RECEIVED",      label: "Eingegangen" },
  { value: "IN_PROGRESS",   label: "In Bearbeitung" },
  { value: "WAITING_PARTS", label: "Wartet auf Teile" },
  { value: "DONE",          label: "Abgeschlossen" },
  { value: "CANCELLED",     label: "Storniert" },
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  REPAIR_STATUSES.filter((s) => s.value).map((s) => [s.value, s.label])
);

interface Repair {
  id: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  status: string;
  estimatedPrice?: number;
  finalPrice?: number;
  adminNotes?: string;
  createdAt: string;
  user: { name?: string; email: string; phone?: string };
}

function EditModal({
  repair, onClose,
}: {
  repair: Repair;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    status:         repair.status,
    finalPrice:     repair.finalPrice ?? "",
    estimatedPrice: repair.estimatedPrice ?? "",
    adminNotes:     repair.adminNotes ?? "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/repairs/${repair.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          status:         form.status,
          finalPrice:     form.finalPrice ? Number(form.finalPrice) : undefined,
          estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
          adminNotes:     form.adminNotes || undefined,
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-repairs"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Reparatur bearbeiten</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-slate-900/50 rounded-xl text-sm">
            <p className="text-white font-medium">{repair.deviceModel} – {repair.issue}</p>
            <p className="text-slate-500 text-xs mt-1">{repair.user.email}</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="input-field"
            >
              {REPAIR_STATUSES.filter((s) => s.value).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Kostenvoranschlag (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.estimatedPrice}
                onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Endpreis (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.finalPrice}
                onChange={(e) => setForm({ ...form, finalPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Notiz für Kunden</label>
            <textarea
              rows={3}
              value={form.adminNotes}
              onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
              placeholder="Notiz, die per E-Mail gesendet wird..."
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Abbrechen</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save size={15} />
            )}
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRepairsPage() {
  const [status,     setStatus]     = useState("");
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [editRepair, setEditRepair] = useState<Repair | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-repairs", status, search, page],
    queryFn:  () => {
      const qs = new URLSearchParams({ page: String(page), ...(status && { status }), ...(search && { search }) }).toString();
      return fetch(`/api/admin/repairs?${qs}`).then((r) => r.json()).then((r) => r.data);
    },
  });

  const repairs    = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {editRepair && <EditModal repair={editRepair} onClose={() => setEditRepair(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Reparaturen</h1>
        <p className="text-slate-400 text-sm">{pagination?.total ?? 0} Aufträge insgesamt</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Suchen..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {REPAIR_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                status === s.value
                  ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table-base">
          <thead>
            <tr>
              <th>Gerät / Problem</th>
              <th>Kunde</th>
              <th>Status</th>
              <th>Preis</th>
              <th>Datum</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Lädt...</td></tr>
            ) : repairs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Keine Einträge gefunden.</td></tr>
            ) : (
              repairs.map((r: Repair) => (
                <tr key={r.id}>
                  <td>
                    <p className="font-medium text-white">{r.deviceModel}</p>
                    <p className="text-xs text-slate-500">{r.issue}</p>
                  </td>
                  <td>
                    <p className="text-sm">{r.user.name ?? "–"}</p>
                    <p className="text-xs text-slate-500">{r.user.email}</p>
                  </td>
                  <td><Badge status={r.status}>{STATUS_LABELS[r.status] ?? r.status}</Badge></td>
                  <td>
                    {r.finalPrice
                      ? <span className="text-green-400 font-semibold">{formatPrice(r.finalPrice)}</span>
                      : r.estimatedPrice
                      ? <span className="text-slate-400">ca. {formatPrice(r.estimatedPrice)}</span>
                      : "–"}
                  </td>
                  <td className="text-slate-400">{formatDate(r.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => setEditRepair(r)}
                      className="text-xs btn-outline !py-1.5 !px-3"
                    >
                      Bearbeiten
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50">
            Zurück
          </button>
          <span className="flex items-center text-sm text-slate-400 px-4">
            Seite {page} von {pagination.totalPages}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-50">
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
