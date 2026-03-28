"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, CheckCircle } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";

// Zod infer type shim
type ForgotPasswordInput = { email: string };

export default function ForgotPasswordPage() {
  const [sent,   setSent]   = useState(false);
  const [error,  setError]  = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Fehler"); return; }
      setSent(true);
    } catch {
      setError("Serverfehler.");
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="card text-center">
          <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">E-Mail gesendet</h2>
          <p className="text-slate-400 mb-6">
            Falls ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen des Passworts gesendet.
          </p>
          <Link href="/login" className="btn-primary inline-flex">Zur Anmeldung</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Passwort vergessen?</h1>
          <p className="text-slate-400 text-sm">Wir senden dir einen Link zum Zurücksetzen.</p>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">E-Mail-Adresse *</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                autoComplete="email"
                placeholder="deine@email.de"
                className="input-field pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Wird gesendet..." : "Link anfordern"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            ← Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  );
}
