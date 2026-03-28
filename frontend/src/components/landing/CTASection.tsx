import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-gray-50 dark:bg-[#151515] border-t border-gray-200 dark:border-[#333333] transition-colors duration-300 py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bereit? Wir helfen dir weiter.
          </h2>

          {/* Subline */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Reparatur anfragen oder dein Gerät jetzt verkaufen – beides dauert nur wenige Minuten.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/repair"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              <span>Reparatur starten</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/buyback"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#333333] text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors duration-200"
            >
              <span>Gerät verkaufen</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Subtext */}
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
            Kostenlos, unverbindlich und ohne Haftung für Zweitschäden.
          </p>
        </div>
      </div>
    </section>
  );
}
