"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Kein Token in der URL gefunden.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setState("success");
          setMessage(json.data?.message ?? "E-Mail erfolgreich bestätigt.");
        } else {
          setState("error");
          setMessage(json.error ?? "Bestätigung fehlgeschlagen.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Serverfehler. Bitte erneut versuchen.");
      });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="card text-center">
        {state === "loading" && (
          <>
            <Loader2 size={48} className="text-primary-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-white mb-2">Bestätigung läuft...</h2>
            <p className="text-slate-400 text-sm">Bitte warten.</p>
          </>
        )}
        {state === "success" && (
          <>
            <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">E-Mail bestätigt!</h2>
            <p className="text-slate-400 mb-6">{message}</p>
            <Link href="/login" className="btn-primary inline-flex">Jetzt anmelden</Link>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">Bestätigung fehlgeschlagen</h2>
            <p className="text-slate-400 mb-6">{message}</p>
            <Link href="/register" className="btn-secondary inline-flex">Neu registrieren</Link>
          </>
        )}
      </div>
    </div>
  );
}
