"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { buybackRequestSchema, type BuybackRequestInput } from "@/lib/validations";
import { BUYBACK_MULTIPLIERS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const CONDITIONS = Object.keys(BUYBACK_MULTIPLIERS);

const CONDITION_DESC: Record<string, string> = {
  "Wie neu":    "Keinerlei Gebrauchsspuren, Originalzustand",
  "Sehr gut":   "Kaum sichtbare Spuren, voll funktionsfähig",
  "Gut":        "Leichte Gebrauchsspuren, alles funktioniert",
  "Akzeptabel": "Deutliche Spuren, aber funktionsfähig",
  "Defekt":     "Gerät ist beschädigt oder funktioniert nicht",
};

const DEVICE_PRICES: Record<string, number> = {
  "iPhone 15 Pro":      1099,
  "iPhone 15":          849,
  "iPhone 14 Pro":      899,
  "iPhone 14":          749,
  "iPhone 13":          649,
  "Samsung Galaxy S24": 899,
  "Samsung Galaxy S23": 749,
  "Samsung Galaxy A54": 349,
  "Google Pixel 8":     749,
};

// Smart detector for IMEI vs Serial Number
function detectIdentifierType(input: string): string {
  const cleaned = input.trim().replace(/\s/g, "");
  if (/^\d{15}$/.test(cleaned)) {
    return "IMEI";
  }
  return "Seriennummer";
}

export default function BuybackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [success,   setSuccess]   = useState(false);
  const [estimate,  setEstimate]  = useState<number | null>(null);
  const [serverErr, setServerErr] = useState("");
  const [serialType, setSerialType] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BuybackRequestInput>({ resolver: zodResolver(buybackRequestSchema) });

  const deviceModel = watch("deviceModel");
  const condition   = watch("condition");
  const serialNumberInput = watch("serialNumber");

  // Smart detection: show what type of identifier was detected
  const detectedType = serialNumberInput ? detectIdentifierType(serialNumberInput) : null;

  // Live estimate
  const liveEstimate = (() => {
    if (!deviceModel || !condition) return null;
    const marketPrice = DEVICE_PRICES[deviceModel] ?? 300;
    const multiplier  = BUYBACK_MULTIPLIERS[condition] ?? 0.2;
    return Math.round(marketPrice * multiplier);
  })();

  const onSubmit = async (data: BuybackRequestInput) => {
    if (!user) { router.push("/login?redirect=/buyback"); return; }
    setServerErr("");
    try {
      const res = await fetch("/api/buybacks", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setServerErr(json.error ?? "Fehler bei der Anfrage."); return; }
      setEstimate(Number(json.data?.offeredPrice ?? 0));
      setSuccess(true);
    } catch {
      setServerErr("Serverfehler. Bitte versuche es später erneut.");
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="card max-w-md text-center mx-4">
            <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">Anfrage eingegangen!</h2>
            {estimate && (
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 my-4">
                <p className="text-slate-400 text-sm mb-1">Unser Angebot</p>
                <p className="text-3xl font-black text-primary-400">{formatPrice(estimate)}</p>
                <p className="text-xs text-slate-500 mt-1">Vorbehaltlich der Prüfung</p>
              </div>
            )}
            <p className="text-slate-400 text-sm mb-6">
              Wir prüfen deine Anfrage und melden uns innerhalb von 24 Stunden.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => router.push("/dashboard/buybacks")} className="btn-primary">
                Meine Anfragen
              </button>
              <button onClick={() => setSuccess(false)} className="btn-secondary">
                Weitere Anfrage
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={30} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Gerät verkaufen</h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Erhalte einen fairen Sofortpreis für dein altes Gerät. Schnelle Abwicklung, sofortige Bezahlung.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2 card">
              {serverErr && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  {serverErr}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Device type */}
                <div>
                  <label className="block text-sm text-slate-400 mb-3">Geräte-Typ *</label>
                  <select className="input-field" {...register("deviceType")}>
                    <option value="">-- Typ auswählen --</option>
                    <option value="PHONE">Smartphone</option>
                    <option value="TABLET">Tablet</option>
                    <option value="LAPTOP">Laptop</option>
                    <option value="PC">PC</option>
                    <option value="CONSOLE">Konsole</option>
                    <option value="OTHER">Sonstiges</option>
                  </select>
                  {errors.deviceType && <p className="text-red-400 text-xs mt-1">{errors.deviceType.message}</p>}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Modell *</label>
                  <input
                    type="text"
                    list="device-models"
                    placeholder="z.B. iPhone 14, Samsung Galaxy S23"
                    className="input-field"
                    {...register("deviceModel")}
                  />
                  <datalist id="device-models">
                    {Object.keys(DEVICE_PRICES).map((m) => <option key={m} value={m} />)}
                  </datalist>
                  {errors.deviceModel && <p className="text-red-400 text-xs mt-1">{errors.deviceModel.message}</p>}
                </div>

                {/* Serial Number / IMEI */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">
                    Seriennummer oder IMEI *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="z. B. 356789012345678"
                      className="input-field uppercase"
                      {...register("serialNumber")}
                    />
                    {serialNumberInput && detectedType && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                        {detectedType}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    Pflichtfeld zur eindeutigen Identifikation deines Geräts
                  </p>
                  {errors.serialNumber && <p className="text-red-400 text-xs mt-1">{errors.serialNumber.message}</p>}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm text-slate-400 mb-3">Zustand *</label>
                  <div className="space-y-2">
                    {CONDITIONS.map((c) => (
                      <label key={c} className="cursor-pointer flex items-start gap-3 p-3 border border-slate-700 rounded-xl has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500/10 transition-all hover:border-primary-500">
                        <input type="radio" value={c} {...register("condition")} className="mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white">{c}</p>
                          <p className="text-xs text-slate-500">{CONDITION_DESC[c]}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.condition && <p className="text-red-400 text-xs mt-1">{errors.condition.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Weitere Details (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Gibt es Kratzer, Schäden, fehlendes Zubehör?"
                    className="input-field resize-none"
                    {...register("description")}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  {!user ? "Anmelden & anfragen" : "Ankaufsanfrage senden"}
                </button>
              </form>
            </div>

            {/* Live estimate */}
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-black text-white mb-4 flex items-center gap-2">
                  <RefreshCw size={18} className="text-primary-400" />
                  Sofortpreis
                </h3>
                {liveEstimate ? (
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-400 mb-1">Unser Angebot</p>
                    <p className="text-3xl font-black text-primary-400">{formatPrice(liveEstimate)}</p>
                    <p className="text-xs text-slate-500 mt-1">Vorbehaltlich der Prüfung</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Wähle Modell und Zustand für eine Schätzung.</p>
                )}
              </div>

              <div className="card space-y-3">
                <h3 className="font-black text-white text-base">Ablauf</h3>
                {[
                  "Anfrage stellen",
                  "Wir prüfen dein Gerät",
                  "Finales Angebot bestätigen",
                  "Sofortige Auszahlung",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-primary-400 text-xs flex items-center justify-center font-semibold flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
