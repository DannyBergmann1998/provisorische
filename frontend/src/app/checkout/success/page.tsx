"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get("orderId");
  const clearCart    = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="container-custom text-center max-w-lg">
          <div className="card">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={44} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Bestellung erfolgreich!</h1>
            <p className="text-slate-400 mb-6">
              Vielen Dank für deine Bestellung. Wir haben dir eine Bestätigungs-E-Mail gesendet
              und beginnen sofort mit der Bearbeitung.
            </p>

            {orderId && (
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-sm">
                <p className="text-slate-500">Bestellnummer</p>
                <p className="text-white font-mono font-semibold mt-1 text-xs">{orderId}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard/orders" className="btn-primary flex items-center justify-center gap-2">
                <Package size={16} />
                Meine Bestellungen
              </Link>
              <Link href="/shop" className="btn-secondary flex items-center justify-center gap-2">
                <ShoppingBag size={16} />
                Weiter einkaufen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
