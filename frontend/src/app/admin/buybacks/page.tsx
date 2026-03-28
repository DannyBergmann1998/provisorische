"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUSES = [
  { value: "",          label: "Alle" },
  { value: "PENDING",   label: "Ausstehend" },
  { value: "REVIEWED",  label: "Geprüft" },
  { value: "ACCEPTED",  label: "Akzeptiert" },
  { value: "REJECTED",  label: "Abgelehnt" },
  { value: "COMPLETED", label: "Abgeschlossen" },
];

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  STATUSES.filter((s) => s.value).map((s) => [s.value, s.label])
);

interface Buyback {
  id: string;
  deviceModel: string;
  deviceType: string;
  serialNumber: string;
  condition: string;
  offeredPrice: number;
  finalPrice?: number;
  status: string;
  adminNotes?: string;
  createdAt: string;
  user: { name?: string; email: string; phone?: string };
}

function EditModal({ buyback, onClose }: { buyback: Buyback; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    status:     buyback.status,
    finalPrice: buyback.finalPrice ?? buyback.offeredPrice,
    adminNotes: buyback.adminNotes ?? "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      fetch(`/api/admin/buybacks/${buyback.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, finalPrice: Number(form.finalPrice) }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-buybacks"] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-black">Ankauf bearbeiten</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black"><X size={20} /></button>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-sm mb-4">
          <p className="text-black font-medium">{buyback.deviceModel}</p>
          <p className="text-gray-500 text-xs">{buyback.condition} · Angebot: {formatPrice(buyback.offeredPrice)}</p>
          <p className="text-gray-500 text-xs">IMEI/Seriennummer: <span className="font-mono">{buyback.serialNumber}</span></p>
          <p className="text-gray-500 text-xs">{buyback.user.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
              {STATUSES.filter((s) => s.value).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Finaler Ankaufspreis (€)</label>
            <input
              type="number"
              step="0.01"
              value={form.finalPrice}
              onChange={(e) => setForm({ ...form, finalPrice: parseFloat(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Notiz</label>
            <textarea
              rows={2}
              value={form.adminNotes}
              onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Abbrechen</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {mutation.isPending ? <span className="animate-spin h-4 w-4 rounded-full border-2 border-black/30 border-t-black" /> : <Save size={15} />}
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBuybacksPage() {
  const [status, setStatus] = useState("");
  const [page,   setPage]   = useState(1);
  const [editB,  setEditB]  = useState<Buyback | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-buybacks", status, page],
    queryFn:  () => {
      const qs = new URLSearchParams({ page: String(page), ...(status && { status }) }).toString();
      return fetch(`/api/admin/buybacks?${qs}`).then((r) => r.json()).then((r) => r.data);
    },
  });

  const buybacks   = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {editB && <EditModal buyback={editB} onClose={() => setEditB(null)} />}

      <div>
        <h1 className="text-2xl font-semibold text-black mb-1">Ankäufe</h1>
        <p className="text-gray-600 text-sm">{pagination?.total ?? 0} Ankaufanfragen</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              status === s.value
                ? "bg-primary-100 text-primary-700 border border-primary-300"
                : "bg-gray-100 text-gray-600 hover:text-black border border-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="table-base">
          <thead>
            <tr>
              <th>Gerät</th>
              <th>IMEI/Seriennummer</th>
              <th>Kunde</th>
              <th>Zustand</th>
              <th>Angebot</th>
              <th>Endpreis</th>
              <th>Status</th>
              <th>Datum</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">Lädt...</td></tr>
            ) : buybacks.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">Keine Ankäufe.</td></tr>
            ) : (
              buybacks.map((b: Buyback) => (
                <tr key={b.id}>
                  <td>
                    <p className="font-medium text-black">{b.deviceModel}</p>
                    <p className="text-xs text-gray-500">{b.deviceType}</p>
                  </td>
                  <td>
                    <p className="font-mono text-sm text-gray-700">{b.serialNumber}</p>
                  </td>
                  <td>
                    <p className="text-sm text-black">{b.user.name ?? "–"}</p>
                    <p className="text-xs text-gray-500">{b.user.email}</p>
                  </td>
                  <td className="text-gray-700 text-sm">{b.condition}</td>
                  <td className="text-gray-700">{formatPrice(b.offeredPrice)}</td>
                  <td>
                    {b.finalPrice
                      ? <span className="text-green-600 font-semibold">{formatPrice(b.finalPrice)}</span>
                      : <span className="text-gray-400">–</span>}
                  </td>
                  <td><Badge status={b.status}>{STATUS_LABELS[b.status] ?? b.status}</Badge></td>
                  <td className="text-gray-600 text-sm">{formatDate(b.createdAt)}</td>
                  <td>
                    <button onClick={() => setEditB(b)} className="text-xs btn-outline !py-1.5 !px-3">
                      Bearbeiten
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
