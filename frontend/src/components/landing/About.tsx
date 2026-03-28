import { CheckCircle } from "lucide-react";

const highlights = [
  "Über 5 Jahre Erfahrung in der Elektronik-Reparatur",
  "Ausgebildeter Elektronik-Techniker & IT-Spezialist",
  "Mehrmonatige praktische Ausbildung in Apple-Geräte-Reparatur",
  "Spezialisiert auf Apple, Samsung, Huawei und Xiaomi",
  "Mehr als 2.000 erfolgreich reparierte Geräte",
  "Nur geprüfte Ersatzteile von zuverlässigen Lieferanten",
  "Persönlicher Ansprechpartner – kein Call-Center",
  "Datenschutz wird großgeschrieben",
];

export function About() {
  return (
    <section id="about" className="section bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image/Illustration side */}
          <div className="relative">
            <div className="relative bg-gray-50 dark:bg-[#262626] rounded-2xl p-8 border border-gray-200 dark:border-[#333333] overflow-hidden">
              {/* Stats cards */}
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { label: "Reparaturen",    value: "2000+" },
                  { label: "Stammkunden",   value: "500+" },
                  { label: "Jahre Erfahrung", value: "5+" },
                  { label: "Garantie",       value: "6 Mon." },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-[#333333] rounded-xl p-4 text-center">
                    <p className="text-2xl font-semibold text-black dark:text-white mb-1">{value}</p>
                    <p className="text-gray-600 dark:text-[#A0A0A0] text-xs">{label}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-6 p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
                <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-1">Inhaber</p>
                <p className="text-black dark:text-white font-semibold text-lg">Danny Bergmann</p>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-sm mt-1">
                  Elektronik-Techniker & IT-Spezialist
                </p>
                <p className="text-gray-600 dark:text-[#A0A0A0] text-xs mt-2 italic">
                  Spezialisiert auf Apple-Reparaturen
                </p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <span className="inline-block text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Über uns
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-6">
              Leidenschaft für Technik
            </h2>
            <p className="text-gray-700 dark:text-[#E0E0E0] leading-relaxed mb-4">
              HandyUndPCService ist ein inhabergeführtes Reparaturgeschäft mit über 5 Jahren Erfahrung in
              der professionellen Reparatur von Smartphones, Laptops, PCs und Spielkonsolen.
            </p>
            <p className="text-gray-700 dark:text-[#E0E0E0] leading-relaxed mb-4">
              Mit fundierter Ausbildung und mehrmonatiger praktischer Erfahrung in der Reparatur von Apple-Geräten
              im professionellen Umfeld. Spezialisiert auf die Reparatur führender Hersteller wie Apple, Samsung, Huawei und Xiaomi.
            </p>
            <p className="text-gray-700 dark:text-[#E0E0E0] leading-relaxed mb-8">
              Als ausgebildeter Elektronik-Techniker liegt mir Qualität und Transparenz am Herzen.
              Kein Gerät ist zu komplex – und jeder Kunde wird fair und persönlich beraten.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((point) => (
                <li key={point} className="flex items-start gap-3 text-gray-700 dark:text-[#E0E0E0] text-sm">
                  <CheckCircle size={18} className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
