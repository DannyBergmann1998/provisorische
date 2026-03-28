"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [showPass,    setShowPass]    = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [serverErr,   setServerErr]   = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerErr(json.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      if (json.data?.requiresTwoFactor) {
        setRequires2FA(true);
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerErr("Serverfehler. Bitte erneut versuchen.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Willkommen zurück</h1>
          <p className="text-slate-400 text-sm">Melde dich in deinem Konto an.</p>
        </div>

        {serverErr && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            {serverErr}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">E-Mail *</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="max@beispiel.de"
              className="input-field"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-slate-400">Passwort *</label>
              <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300">
                Vergessen?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Dein Passwort"
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
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* 2FA */}
          {requires2FA && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">
                2FA-Code (Authenticator App) *
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="input-field text-center tracking-widest text-lg"
                {...register("totp")}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
            ) : (
              <LogIn size={16} />
            )}
            {isSubmitting ? "Anmelden..." : "Anmelden"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Noch kein Konto?{" "}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
