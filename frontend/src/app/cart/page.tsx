"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, Package } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 49;
const SHIPPING_COST      = 4.99;

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  const subtotal    = totalPrice();
  const shipping    = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total       = subtotal + shipping;
  const toFreeShip  = SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart size={72} className="mx-auto mb-4 text-slate-700" />
            <h1 className="text-2xl font-bold text-white mb-2">Dein Warenkorb ist leer</h1>
            <p className="text-slate-400 mb-6">Entdecke unsere Produkte und füge sie hinzu.</p>
            <Link href="/shop" className="btn-primary">Zum Shop</Link>
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
          <h1 className="text-3xl font-black text-white mb-8">Warenkorb</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="card flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} className="font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-primary-400 font-bold mt-1">{formatPrice(item.price)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="text-slate-500 text-xs ml-2">
                        Auf Lager: {item.stock}
                      </span>
                    </div>
                  </div>

                  {/* Total + Remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Free shipping progress */}
              {toFreeShip > 0 && (
                <div className="card">
                  <p className="text-sm text-slate-400 mb-2">
                    Noch <span className="text-white font-semibold">{formatPrice(toFreeShip)}</span> bis zum kostenlosen Versand!
                  </p>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="card">
                <h2 className="text-lg font-bold text-white mb-5">Zusammenfassung</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Zwischensumme</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Versand</span>
                    <span className={shipping === 0 ? "text-green-400 font-medium" : "text-white"}>
                      {shipping === 0 ? "Kostenlos" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Inkl. 19% MwSt.</span>
                    <span>{formatPrice(total - total / 1.19)}</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-5">
                  <div className="flex justify-between text-lg font-black">
                    <span className="text-white">Gesamt</span>
                    <span className="text-primary-400">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/shop" className="block text-center text-sm text-slate-500 hover:text-slate-300 mt-3 transition-colors">
                  Weiter einkaufen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
