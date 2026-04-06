import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="kontakt" style={{ background: "#080808", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12 pb-12" style={{ borderBottom: "1px solid var(--border)" }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-7 h-7">
                <Image
                  src="/logo.png"
                  alt="Handy & PC Service"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                Handy & PC Service
              </span>
            </div>
            <p className="text-[14px] leading-relaxed max-w-[240px]" style={{ color: "var(--text-3)" }}>
              Professionelle Reparaturen für Smartphones, PCs und Laptops.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-label mb-5" style={{ color: "var(--text-3)" }}>
              Kontakt
            </p>
            <a
              href="mailto:handyundpcservice@gmail.com"
              className="block text-[14px] mb-1 transition-colors duration-150 hover:text-white"
              style={{ color: "var(--accent)" }}
            >
              handyundpcservice@gmail.com
            </a>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:handyundpcservice@gmail.com?subject=Reparaturanfrage"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 24px rgba(10,132,255,0.2)",
              }}
            >
              Reparatur anfragen →
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-6">
          <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
            © {year} Handy & PC Service
          </p>
          <p className="text-[12px]" style={{ color: "#333" }}>
            Made in Deutschland
          </p>
        </div>
      </div>
    </footer>
  );
}
