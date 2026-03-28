"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [serverErr, setServerErr] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const passwordChecks = [
    { ok: password.length >= 8,           label: "Mindestens 8 Zeichen" },
    { ok: /[A-Z]/.test(password),         label: "Großbuchstabe" },
    { ok: /[a-z]/.test(password),         label: "Kleinbuchstabe" },
    { ok: /[0-9]/.test(password),         label: "Ziffer" },
    { ok: /[^A-Za-z0-9]/.test(password),  label: "Sonderzeichen" },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setServerErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerErr(json.error ?? "Registrierung fehlgeschlagen.");
        return;
      }

      setSuccess(true);
    } catch {
      setServerErr("Serverfehler. Bitte erneut versuchen.");
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card text-center">
          <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Konto erstellt!</h2>
          <p className="text-slate-400 mb-6">
            Wir haben dir eine Bestätigungs-E-Mail gesendet. Bitte überprüfe dein Postfach und
            klicke auf den Link, um dein Konto zu aktivieren.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Konto erstellen</h1>
          <p className="text-slate-400 text-sm">Kostenlos registrieren und Vorteile genießen.</p>
        </div>

        {serverErr && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            {serverErr}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Max Mustermann"
              className="input-field"
              {...register("name")}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">E-Mail *</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="max@beispiel.de"
              className="input-field"
              {...register("email")}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Telefon (optional)</label>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+49 123 456789"
              className="input-field"
              {...register("phone")}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Passwort *</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Sicheres Passwort"
                className="input-field pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password strength */}
            {password && (
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {passwordChecks.map(({ ok, label }) => (
                  <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-400" : "text-slate-500"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-slate-600"}`} />
                    {label}
                  </div>
                ))}
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
            ) : (
              <UserPlus size={16} />
            )}
            {isSubmitting ? "Registrieren..." : "Konto erstellen"}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          Mit der Registrierung stimmst du unserer{" "}
          <Link href="/datenschutz" className="text-primary-400 hover:underline">Datenschutzerklärung</Link>
          {" "}und den{" "}
          <Link href="/agb" className="text-primary-400 hover:underline">AGB</Link> zu.
        </p>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Bereits registriert?{" "}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
