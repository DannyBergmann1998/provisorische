"use client";

import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/shop/ProductCard";

// TODO: Fetch products from Kotlin backend
const products: Array<{
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number;
  stock: number;
  images: string[];
  category?: { name: string };
}> = [];

export default function ShopPage() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-white mb-2">Online Shop</h1>
            <p className="text-slate-400">Generalüberholte Geräte und Zubehör – günstig, geprüft, mit Garantie.</p>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Produkt suchen..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold text-slate-400">Keine Produkte gefunden</p>
              <p className="text-sm mt-1">Der Shop wird bald mit Produkten gefüllt.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
