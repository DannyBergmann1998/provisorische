"use client";

import { useCookieConsent } from "@/lib/cookie-consent-context";
import Link from "next/link";

export function CookieBanner() {
  const { consent, acceptAll, acceptNecessaryOnly } = useCookieConsent();

  // Only show banner if no consent decision has been made
  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#151515] border-t border-gray-200 dark:border-[#333333] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {/* Message */}
          <div>
            <p className="text-sm text-gray-700 dark:text-[#E0E0E0] leading-relaxed">
              Wir verwenden Cookies, um die Funktionalität der Website sicherzustellen und optionale
              Analysefunktionen zu ermöglichen. Notwendige Cookies werden immer geladen.{" "}
              <Link
                href="/privacy"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Mehr erfahren
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={acceptNecessaryOnly}
              className="btn-secondary"
            >
              Nur notwendige Cookies
            </button>
            <button
              onClick={acceptAll}
              className="btn-primary"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
