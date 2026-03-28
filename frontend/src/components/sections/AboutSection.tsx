import { CheckCircle, Smartphone, Cpu, ShoppingCart, Wrench } from "lucide-react";

export function AboutSection() {
  const trustReasons = [
    "Fachgerechte Reparaturen mit Erfahrung",
    "Transparente Preise ohne versteckte Kosten",
    "Schnelle Abwicklung und ehrliche Bewertung",
    "Fokus auf Qualität statt Massenabfertigung",
  ];

  const services = [
    {
      icon: Smartphone,
      text: "Smartphone-Reparaturen (Apple, Samsung, Huawei, Xiaomi)",
    },
    {
      icon: Cpu,
      text: "PC- und Konsolen-Reparatur",
    },
    {
      icon: ShoppingCart,
      text: "Ankauf von gebrauchten Geräten",
    },
    {
      icon: Wrench,
      text: "Generalüberholung von Technik",
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0A0A0A] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* About Intro */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Über uns
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            Handy & PC Service steht für zuverlässige, professionelle Reparaturen und faire Ankaufspreise
            im Bereich moderner Elektronik.
          </p>
        </div>

        {/* Owner Section */}
        <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl p-8 mb-16 border border-gray-200 dark:border-[#333333]">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Inhaber</h3>
          <div className="mb-6">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">Danny Bergmann</p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Elektronik-Techniker & IT-Spezialist
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            Mit fundierter Ausbildung und mehrmonatiger praktischer Erfahrung in der Reparatur von Apple-Geräten
            sowie weiteren führenden Herstellern.
            Spezialisiert auf die Instandsetzung von Smartphones, PCs und Konsolen.
          </p>
        </div>

        {/* Why Trust Us */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Warum Kunden uns vertrauen
          </h3>
          <ul className="space-y-4">
            {trustReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-4">
                <CheckCircle
                  size={24}
                  className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-gray-700 dark:text-gray-200 text-lg">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Unsere Leistungen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#333333] hover:border-gray-300 dark:hover:border-[#404040] transition-colors"
              >
                <Icon
                  size={24}
                  className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-gray-700 dark:text-gray-200">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Vision */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unser Anspruch
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            Wir behandeln jedes Gerät so, als wäre es unser eigenes.
            Unser Ziel ist es, eine zuverlässige und langfristige Lösung für jedes Problem zu finden –
            nicht nur eine kurzfristige Reparatur.
          </p>
        </div>
      </div>
    </section>
  );
}
