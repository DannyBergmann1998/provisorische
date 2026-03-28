import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 flex justify-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
            <Wrench size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white">Handy & PC Service</div>
            <div className="text-xs text-primary-400">Reparatur · Ankauf · Shop</div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
