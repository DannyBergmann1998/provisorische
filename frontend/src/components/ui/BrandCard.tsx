"use client";

import Image from "next/image";

export interface BrandCardProps {
  name: string;
  logo: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function BrandCard({ name, logo, isSelected, onClick }: BrandCardProps) {
  return (
    <button
      onClick={onClick}
      className={`card-hover flex flex-col items-center justify-center gap-3 py-6 px-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary-500" : ""
      }`}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg p-2">
        <Image
          src={logo}
          alt={name}
          width={64}
          height={64}
          className="object-contain w-full h-full text-black dark:text-white"
        />
      </div>
      <p className="text-sm font-semibold text-black dark:text-white text-center">{name}</p>
    </button>
  );
}
