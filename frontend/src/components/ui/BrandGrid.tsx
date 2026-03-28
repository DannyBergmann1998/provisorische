"use client";

import { BrandCard } from "./BrandCard";
import type { RepairBrand } from "@/data/brands";

export interface BrandGridProps {
  brands: RepairBrand[];
  selectedBrand?: string | null;
  onSelect?: (slug: string) => void;
  showTitle?: boolean;
}

export function BrandGrid({ brands, selectedBrand, onSelect, showTitle = true }: BrandGridProps) {
  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-lg font-semibold text-slate-400 text-center mb-4">
          Hersteller wählen (optional)
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <BrandCard
            key={brand.slug}
            name={brand.name}
            logo={brand.logo}
            isSelected={selectedBrand === brand.slug}
            onClick={() => onSelect?.(brand.slug)}
          />
        ))}
      </div>
    </div>
  );
}
