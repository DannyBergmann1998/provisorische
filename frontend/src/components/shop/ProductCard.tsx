"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: {
    id:        string;
    name:      string;
    slug:      string;
    price:     number;
    compareAt?: number | null;
    stock:     number;
    images:    string[];
    category?: { name: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem   = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const inCart      = cartItems.find((i) => i.productId === product.id);
  const isOutOfStock = product.stock === 0;

  const discount = product.compareAt
    ? Math.round(((Number(product.compareAt) - Number(product.price)) / Number(product.compareAt)) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name:      product.name,
      price:     Number(product.price),
      image:     product.images[0] ?? "",
      slug:      product.slug,
      stock:     product.stock,
    });
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group">
      <div className="card-hover overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-slate-800 rounded-xl mb-4 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-slate-600" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-700 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-lg">
                Ausverkauft
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          {product.category && (
            <p className="text-xs text-slate-500 mb-1">{product.category.name}</p>
          )}
          <h3 className="font-semibold text-white text-sm mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4 mt-auto">
            <span className="text-xl font-black text-white">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-slate-500 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isOutOfStock
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : inCart
                ? "bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30"
                : "bg-primary-600 text-white hover:bg-primary-500 active:scale-95"
            }`}
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? "Ausverkauft" : inCart ? "Im Warenkorb" : "In den Warenkorb"}
          </button>
        </div>
      </div>
    </Link>
  );
}
