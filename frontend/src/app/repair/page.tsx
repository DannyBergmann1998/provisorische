"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench, Calculator, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrandGrid } from "@/components/ui/BrandGrid";
import { repairRequestSchema, type RepairRequestInput } from "@/lib/validations";
import { REPAIR_PRICES } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { repairBrands } from "@/data/brands";

const DEVICE_LABELS: Record<string, string> = {
  PHONE:   "Smartphone / Handy",
  PC:      "PC / Desktop",
  LAPTOP:  "Laptop / Notebook",
  CONSOLE: "Spielkonsole",
  TABLET:  "Tablet",
  OTHER:   "Sonstiges",
};

export default function RepairPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);
  const [success, setSuccess]   = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepairRequestInput>({ resolver: zodResolver(repairRequestSchema) });

  const selectedDevice = watch("deviceType");
  const selectedIssue  = watch("issue");

  const issues = selectedDevice ? Object.keys(REPAIR_PRICES[selectedDevice] ?? {}) : [];

  // Live price estimate
  const priceRange = selectedDevice && selectedIssue
    ? REPAIR_PRICES[selectedDevice]?.[selectedIssue]
    : null;

  const onSubmit = async (data: RepairRequestInput) => {
    if (!user) {
      router.push("/login?redirect=/repair");
      return;
    }

    setServerErr("");
    try {
      const res = await fetch("/api/repairs", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerErr(json.error ?? "Fehler beim Absenden.");
        return;
      }
      setSuccess(true);
    } catch {
      setServerErr("Serverfehler. Bitte erneut versuchen.");
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container-custom flex items-center justify-center">
            <div className="card max-w-md text-center">
              <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-3">Anfrage eingegangen!</h2>
              <p className="text-slate-400 mb-6">
                Wir haben deine Reparaturanfrage erhalten und melden uns schnellstmöglich bei dir.
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => router.push("/dashboard/repairs")} className="btn-primary">
                  Meine Aufträge
                </button>
                <button onClick={() => setSuccess(false)} className="btn-secondary">
                  Neue Anfrage
                </button>
              </div>
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
              <Wrench size={30} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Reparatur anfragen</h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Wähle dein Gerät und das Problem. Du erhältst sofort eine Preisschätzung – kostenlos und unverbindlich.
            </p>
          </div>

          {/* Brand selection */}
          <div className="mb-12 max-w-5xl mx-auto">
            <BrandGrid
              brands={repairBrands}
              selectedBrand={selectedBrand}
              onSelect={setSelectedBrand}
              showTitle
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Form */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(DEVICE_LABELS).map(([value, label]) => (
                      <label key={value} className="cursor-pointer">
                        <input type="radio" value={value} {...register("deviceType")} className="sr-only" />
                        <div className="border border-slate-700 rounded-xl p-3 text-center text-sm text-slate-400 hover:border-primary-500 transition-all peer-checked:border-primary-500 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-500/10 has-[:checked]:text-primary-400">
                          {label}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.deviceType && <p className="text-red-400 text-xs mt-1">{errors.deviceType.message}</p>}
                </div>

                {/* Device model */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Gerätename / Modell *</label>
                  <input
                    type="text"
                    placeholder="z.B. iPhone 14, Samsung Galaxy S23, PlayStation 5"
                    className="input-field"
                    {...register("deviceModel")}
                  />
                  {errors.deviceModel && <p className="text-red-400 text-xs mt-1">{errors.deviceModel.message}</p>}
                </div>

                {/* Issue */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Problem / Defekt *</label>
                  {selectedDevice && issues.length > 0 ? (
                    <select className="input-field" {...register("issue")}>
                      <option value="">-- Problem auswählen --</option>
                      {issues.map((issue) => (
                        <option key={issue} value={issue}>{issue}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Beschreibe das Problem..."
                      className="input-field"
                      {...register("issue")}
                    />
                  )}
                  {errors.issue && <p className="text-red-400 text-xs mt-1">{errors.issue.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Detaillierte Beschreibung</label>
                  <textarea
                    rows={4}
                    placeholder="Beschreibe das Problem möglichst genau (optional)..."
                    className="input-field resize-none"
                    {...register("description")}
                  />
                </div>

                {/* Widerruf Checkbox */}
                <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("acceptRepairStart")}
                      className="w-5 h-5 rounded border-slate-600 text-primary-600 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-slate-400">
                      Ich stimme zu, dass mit der Reparatur vor Ablauf der Widerrufsfrist begonnen wird und ich mein Widerrufsrecht verliere.{" "}
                      <a href="/widerruf" className="text-primary-400 hover:text-primary-300 underline">
                        (Mehr Info)
                      </a>
                    </span>
                  </label>
                  {errors.acceptRepairStart && <p className="text-red-400 text-xs mt-2">{errors.acceptRepairStart.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                  {!user
                    ? "Anmelden & anfragen"
                    : isSubmitting
                    ? "Wird gesendet..."
                    : "Reparatur anfragen"}
                </button>
              </form>
            </div>

            {/* Price estimate sidebar */}
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator size={18} className="text-primary-400" />
                  <h3 className="font-bold text-white">Preisschätzung</h3>
                </div>
                {priceRange ? (
                  <>
                    <p className="text-slate-400 text-sm mb-4">Geschätzte Kosten für deine Reparatur:</p>
                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 text-center">
                      <p className="text-3xl font-black text-white">
                        {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">inkl. MwSt. · unverbindlich</p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-sm">
                    Wähle Gerät und Problem für eine Preisschätzung.
                  </p>
                )}
              </div>

              <div className="card space-y-3">
                <h3 className="font-bold text-white text-sm">Inbegriffen</h3>
                {["Kostenloser Kostenvoranschlag", "6 Monate Garantie", "Originale Ersatzteile", "Status-Updates per E-Mail"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                    {item}
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
