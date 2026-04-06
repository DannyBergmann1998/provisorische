import { Mail } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="kontakt" className="bg-[#1d1d1f] text-white">
      {/* Main Footer */}
      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 lg:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="text-lg font-semibold tracking-tight mb-3">Handy & PC Service</p>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Professionelle Reparaturen für Smartphones, PCs und Laptops. Schnell, fair und persönlich.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#6e6e73] mb-5">
              Kontakt
            </p>
            <a
              href="mailto:handyundpcservice@gmail.com"
              className="group inline-flex items-center gap-3 text-[15px] text-[#f5f5f7] hover:text-[#0071e3] transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] group-hover:bg-[#0071e3]/20 flex items-center justify-center transition-colors duration-200">
                <Mail className="w-4 h-4" strokeWidth={1.8} />
              </div>
              handyundpcservice@gmail.com
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#6e6e73] mb-2">
              Jetzt anfragen
            </p>
            <a
              href="mailto:handyundpcservice@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0071e3] text-white text-[14px] font-medium hover:bg-[#0077ed] transition-colors duration-200 shadow-[0_2px_12px_rgba(0,113,227,0.4)]"
            >
              Reparatur anfragen →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6e6e73]">
            © {year} Handy & PC Service. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-[#6e6e73]">
            Made with care in Deutschland
          </p>
        </div>
      </div>
    </footer>
  );
}
