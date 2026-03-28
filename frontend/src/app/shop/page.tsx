"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice } from "@/lib/utils";

type SortOption = "createdAt" | "price" | "name";

export default function ShopPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [sort,     setSort]     = useState<SortOption>("createdAt");
  const [page,     setPage]     = useState(1);

  const queryString = new URLSearchParams({
    ...(search   && { search }),
    ...(category && { category }),
    sort,
    order:  sort === "name" ? "asc" : "desc",
    limit:  "12",
    page:   String(page),
  }).toString();

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category, sort, page],
    queryFn:  () => fetch(`/api/shop/products?${queryString}`).then((r) => r.json()).then((r) => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn:  () => fetch("/api/shop/categories").then((r) => r.json()).then((r) => r.data),
  });

  const products   = data?.data ?? [];
  const pagination = data?.pagination;
  const categories = categoriesData ?? [];

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

          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Produkt suchen..."
                className="input-field pl-10"
              />
            </div>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="input-field sm:w-48"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((c: {slug: string; name: string}) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-field sm:w-48"
            >
              <option value="createdAt">Neueste zuerst</option>
              <option value="price">Preis aufsteigend</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-slate-700 rounded-xl mb-4" />
                  <div className="h-4 bg-slate-700 rounded mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold text-slate-400">Keine Produkte gefunden</p>
              <p className="text-sm mt-1">Versuche eine andere Suche oder Kategorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: {id: string; name: string; slug: string; price: number; compareAt?: number; stock: number; images: string[]; category?: {name: string}}) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50"
              >
                Zurück
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    page === i + 1 ? "bg-primary-600 text-white" : "btn-secondary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50"
              >
                Weiter
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
