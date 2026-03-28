"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardProfilePage() {
  const qc = useQueryClient();
  const { user, invalidate } = useAuth();
  const [msg,   setMsg]   = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name:  user?.name  ?? "",
    phone: "",
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      fetch("/api/auth/me", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      }).then((r) => r.json()),
    onSuccess: (data) => {
      if (data.success) {
        setMsg("Profil gespeichert.");
        invalidate();
        setTimeout(() => setMsg(""), 3000);
      } else {
        setError(data.error ?? "Fehler");
      }
    },
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Mein Profil</h1>
        <p className="text-slate-400 text-sm">Verwalte deine Kontodaten.</p>
      </div>

      {/* Profile info */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
            {user?.name?.[0]?.toUpperCase() ?? user?.email[0].toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-xl font-bold text-white">{user?.name ?? "Nutzer"}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">{user?.role}</span>
              {user?.emailVerified && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} />
                  Bestätigt
                </span>
              )}
            </div>
          </div>
        </div>

        {msg   && <p className="text-green-400 text-sm mb-4 flex items-center gap-2"><CheckCircle size={15} />{msg}</p>}
        {error && <p className="text-red-400 text-sm mb-4 flex items-center gap-2"><AlertCircle size={15} />{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Telefon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="017668917854"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">E-Mail</label>
            <input type="email" value={user?.email ?? ""} disabled className="input-field opacity-50 cursor-not-allowed" />
            <p className="text-xs text-slate-600 mt-1">E-Mail kann nicht geändert werden.</p>
          </div>
        </div>

        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="btn-primary mt-6"
        >
          {updateMutation.isPending ? "Speichert..." : "Änderungen speichern"}
        </button>
      </div>

      {/* 2FA */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-primary-400" />
          <h2 className="text-lg font-bold text-white">Zwei-Faktor-Authentifizierung</h2>
        </div>
        {user?.twoFactorEnabled ? (
          <div className="flex items-center gap-3 text-green-400">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">2FA ist aktiv</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-400">
            <Lock size={18} />
            <span className="text-sm">2FA ist nicht aktiviert</span>
          </div>
        )}
        <p className="text-slate-500 text-xs mt-2">
          Aktiviere 2FA für zusätzliche Sicherheit. Du benötigst eine Authenticator-App (z. B. Google Authenticator).
        </p>
        <a href="/dashboard/profile/2fa" className="btn-outline inline-flex mt-4 text-sm !py-2">
          {user?.twoFactorEnabled ? "2FA verwalten" : "2FA aktivieren"}
        </a>
      </div>
    </div>
  );
}
