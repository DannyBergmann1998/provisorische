"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn:  () => {
      const qs = new URLSearchParams({ page: String(page), ...(search && { search }) }).toString();
      return fetch(`/api/admin/users?${qs}`).then((r) => r.json()).then((r) => r.data);
    },
  });

  const users      = data?.data      ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Nutzer</h1>
        <p className="text-slate-400 text-sm">{pagination?.total ?? 0} Nutzer registriert</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Name oder E-Mail suchen..."
          className="input-field pl-9"
        />
      </div>

      <div className="table-container">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nutzer</th>
              <th>Rolle</th>
              <th>E-Mail bestätigt</th>
              <th>Reparaturen</th>
              <th>Bestellungen</th>
              <th>Registriert</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Lädt...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Keine Nutzer gefunden.</td></tr>
            ) : (
              users.map((u: {id: string; name?: string; email: string; role: string; emailVerified: boolean; createdAt: string; _count: {repairs: number; orders: number; buybacks: number}}) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        {u.name?.[0]?.toUpperCase() ?? u.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{u.name ?? "–"}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><Badge status={u.role}>{u.role}</Badge></td>
                  <td>
                    {u.emailVerified
                      ? <CheckCircle size={16} className="text-green-400" />
                      : <XCircle size={16} className="text-slate-600" />}
                  </td>
                  <td className="text-slate-300">{u._count.repairs}</td>
                  <td className="text-slate-300">{u._count.orders}</td>
                  <td className="text-slate-400 text-sm">{formatDate(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
