import Link from "next/link";
import { Wrench, ShoppingBag, Apple, Smartphone, Laptop, Gamepad2, ArrowRight } from "lucide-react";

export function RepairShopSplit() {
  return (
    <section className="section bg-white dark:bg-[#0A0A0A]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Repair Card */}
          <Link
            href="/repair"
            className="card card-hover min-h-[320px] flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
                <Wrench size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Gerät reparieren lassen
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Schnelle, fachgerechte Reparaturen für Smartphones, PCs und Konsolen. Kostenlos und unverbindlich.
              </p>

              {/* Brand Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Apple size={12} /> Apple
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone size={12} /> Samsung
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone size={12} /> Huawei
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone size={12} /> Xiaomi
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
              <span>Jetzt anfragen</span>
              <ArrowRight size={18} />
            </div>
          </Link>

          {/* Shop Card */}
          <Link
            href="/shop"
            className="card card-hover min-h-[320px] flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Generalüberholte Geräte kaufen
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Geprüfte Technik zum fairen Preis – mit 6 Monaten Garantie und voller Funktionalität.
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Smartphone size={12} /> Smartphones
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Laptop size={12} /> Laptops
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Gamepad2 size={12} /> Konsolen
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
              <span>Shop entdecken</span>
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
