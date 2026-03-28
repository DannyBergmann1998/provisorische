"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export function Contact() {
  const [form,    setForm]    = useState({ name: "", email: "", message: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: Submit to Kotlin backend
    setSent(true);
    setForm({ name: "", email: "", message: "", phone: "" });
    setLoading(false);
  };

  return (
    <section id="contact" className="section bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Kontakt
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            Nimm Kontakt auf
          </h2>
          <p className="text-gray-600 dark:text-[#A0A0A0] max-w-xl mx-auto">
            Hast du Fragen oder möchtest eine Reparatur anfragen? Wir antworten schnell und unkompliziert.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: "Adresse",       value: "Grömitzer Straße 4\n23730 Schashagen" },
              { icon: Phone,  label: "Telefon",        value: "017668917854" },
              { icon: Mail,   label: "E-Mail",         value: "info@handyundpcservice.de" },
              { icon: Clock,  label: "Öffnungszeiten", value: "Mo–Fr: 9–18 Uhr\nSa: 10–14 Uhr" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-[#151515] rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Icon size={18} className="text-black dark:text-white" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mb-1">{label}</p>
                  <p className="text-black dark:text-white font-medium whitespace-pre-line text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="card">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle size={40} className="text-green-600 dark:text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Nachricht gesendet!</h3>
                  <p className="text-gray-600 dark:text-[#A0A0A0]">Wir melden uns schnellstmöglich bei dir.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-[#E0E0E0] mb-2 font-medium">Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Max Mustermann"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-[#E0E0E0] mb-2 font-medium">Telefon</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="017668917854"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E0E0E0] mb-2 font-medium">E-Mail *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="max@beispiel.de"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#E0E0E0] mb-2 font-medium">Nachricht *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Beschreibe dein Anliegen..."
                      className="input-field resize-none"
                    />
                  </div>
                  {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black" />
                    ) : (
                      <Send size={16} />
                    )}
                    {loading ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
