import Link from "next/link";
import Image from "next/image";
import { Wrench, Mail, Phone, MapPin, Instagram } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-[#262626] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Wrench size={16} className="text-white dark:text-black" />
              </div>
              <div>
                <div className="font-semibold text-black dark:text-white text-sm">Handy & PC Service</div>
                <div className="text-xs text-gray-600 dark:text-[#A0A0A0]">Reparatur · Ankauf · Shop</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-[#A0A0A0] text-sm leading-relaxed max-w-xs mb-6">
              Ihr zuverlässiger Partner für professionelle Geräte-Reparaturen, faire Ankaufspreise und
              generalüberholte Elektronik.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-[#A0A0A0]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary-600 dark:text-primary-400" />
                Grömitzer Straße 4, 23730 Schashagen
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary-600 dark:text-primary-400" />
                017668917854
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary-600 dark:text-primary-400" />
                info@handyundpcservice.de
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Leistungen</h4>
            <ul className="space-y-2">
              {[
                ["Handy-Reparatur",  "/repair"],
                ["PC-Reparatur",     "/repair"],
                ["Konsolen",         "/repair"],
                ["Geräte verkaufen", "/buyback"],
                ["Online Shop",      "/shop"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              {[
                ["Impressum",     "/impressum"],
                ["Datenschutz",   "/datenschutz"],
                ["AGB",           "/agb"],
                ["Widerruf",      "/widerruf"],
                ["Cookie-Policy", "/cookies"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-600 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="pt-8 pb-8 border-t border-gray-200 dark:border-[#262626]">
          <h4 className="font-semibold text-black dark:text-white mb-6 text-sm">Zahlungsmethoden</h4>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { src: "/payments/visa.svg", alt: "Visa" },
              { src: "/payments/mastercard.svg", alt: "Mastercard" },
              { src: "/payments/maestro.svg", alt: "Maestro" },
              { src: "/payments/paypal.svg", alt: "PayPal" },
              { src: "/payments/google-pay.svg", alt: "Google Pay" },
              { src: "/payments/apple-pay.svg", alt: "Apple Pay" },
            ].map((payment) => (
              <img
                key={payment.alt}
                src={payment.src}
                alt={payment.alt}
                className="h-10 object-contain rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default"
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © {year} Handy & PC Service – Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 dark:text-[#A0A0A0] hover:text-black dark:hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
