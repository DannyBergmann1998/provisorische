"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Package, X, Save, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number;
  stock: number;
  sku?: string;
  published: boolean;
  featured: boolean;
  category?: { name: string };
}

function ProductModal({
  product,
  onClose,
}: {
  product?: Product;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!product;
  const [form, setForm] = useState({
    name:      product?.name ?? "",
    slug:      product?.slug ?? "",
    price:     product?.price ?? "",
    compareAt: product?.compareAt ?? "",
    stock:     product?.stock ?? 0,
    sku:       product?.sku ?? "",
    published: product?.published ?? false,
    featured:  product?.featured ?? false,
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      const url    = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      return fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...form,
          price:     Number(form.price),
          compareAt: form.compareAt ? Number(form.compareAt) : undefined,
          stock:     Number(form.stock),
          images:    [],
        }),
      }).then((r) => r.json());
    },
    onSuccess: (data) => {
      if (!data.success) { setError(data.error ?? "Fehler"); return; }
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      onClose();
    },
    onError: () => setError("Serverfehler"),
  });

  const autoSlug = (name: string) =>
    name.toLowerCase()
      .replace(/[äöüß]/g, (c: string) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] ?? c))
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Produkt bearbeiten" : "Neues Produkt"}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Preis (€) *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value as unknown as number })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">UVP (€)</label>
              <input type="number" step="0.01" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value as unknown as number })} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Lagerbestand</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">SKU</label>
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-primary-500" />
              <span className="text-sm text-slate-400">Veröffentlicht</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-primary-500" />
              <span className="text-sm text-slate-400">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Abbrechen</button>
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {mutation.isPending ? <span className="animate-spin h-4 w-4 rounded-full border-2 border-white/30 border-t-white" /> : <Save size={15} />}
            {isEdit ? "Speichern" : "Erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const [modal,  setModal]  = useState<"new" | Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, page],
    queryFn:  () => {
      const qs = new URLSearchParams({ page: String(page), ...(search && { search }) }).toString();
      return fetch(`/api/admin/products?${qs}`).then((r) => r.json()).then((r) => r.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/products/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const products   = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {modal && (
        modal === "new"
          ? <ProductModal onClose={() => setModal(null)} />
          : <ProductModal product={modal as Product} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Produkte</h1>
          <p className="text-slate-400 text-sm">{pagination?.total ?? 0} Produkte</p>
        </div>
        <button onClick={() => setModal("new")} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Neues Produkt
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Produkt suchen..."
          className="input-field pl-9"
        />
      </div>

      <div className="table-container">
        <table className="table-base">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Preis</th>
              <th>Lager</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">Lädt...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">Keine Produkte.</td></tr>
            ) : (
              products.map((p: Product) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.sku ?? p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-semibold text-white">{formatPrice(p.price)}</p>
                    {p.compareAt && <p className="text-xs text-slate-500 line-through">{formatPrice(p.compareAt)}</p>}
                  </td>
                  <td>
                    <span className={p.stock <= 3 ? "text-red-400 font-semibold" : "text-slate-300"}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {p.published && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Live</span>}
                      {p.featured  && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Featured</span>}
                      {!p.published && <span className="text-xs bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded-full">Entwurf</span>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setModal(p)} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700">
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => confirm("Wirklich löschen?") && deleteMutation.mutate(p.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
