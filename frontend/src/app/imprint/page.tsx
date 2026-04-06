import { Metadata } from "next";
import { Navbar }   from "@/components/ui/Navbar";
import { Footer }   from "@/sections/Footer";

export const metadata: Metadata = {
  title:  "Impressum – Handy & PC Service",
  robots: "noindex",
};

const sections = [
  {
    id:    "angaben",
    label: "§ 5 TMG",
    title: "Angaben gemäß § 5 TMG",
    content: (
      <div className="space-y-1 text-[15px]" style={{ color: "var(--text-2)" }}>
        <p style={{ color: "var(--text)", fontWeight: 500 }}>Danny Bergmann</p>
        <p>
          Telefon:{" "}
          <a
            href="tel:+4917783448122"
            className="transition-colors duration-150 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            +49 1778344812
          </a>
        </p>
        <p>
          E-Mail:{" "}
          <a
            href="mailto:handyundpcservice@gmail.com"
            className="transition-colors duration-150 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            handyundpcservice@gmail.com
          </a>
        </p>
      </div>
    ),
  },
  {
    id:    "verantwortlich",
    label: "§ 18 MStV",
    title: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    content: (
      <p className="text-[15px]" style={{ color: "var(--text-2)" }}>
        Danny Bergmann
      </p>
    ),
  },
  {
    id:    "haftung-inhalte",
    label: "Haftung",
    title: "Haftung für Inhalte",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
        keine Gewähr übernehmen.
      </p>
    ),
  },
  {
    id:    "haftung-links",
    label: "Links",
    title: "Haftung für Links",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte
        wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
        keine Gewähr übernehmen.
      </p>
    ),
  },
  {
    id:    "urheberrecht",
    label: "Urheberrecht",
    title: "Urheberrecht",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
        unterliegen dem deutschen Urheberrecht.
      </p>
    ),
  },
];

export default function ImpressumPage() {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">

          {/* Page header */}
          <div className="mb-16">
            <p className="text-label mb-4" style={{ color: "var(--text-3)" }}>
              Rechtliches
            </p>
            <h1
              className="text-heading"
              style={{ color: "var(--text)" }}
            >
              Impressum
            </h1>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                {/* Label + title */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded"
                    style={{
                      color:      "var(--text-3)",
                      background: "var(--surface-2)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    {s.label}
                  </span>
                  <h2
                    className="text-[17px] font-semibold"
                    style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </h2>
                </div>

                {/* Rule */}
                <div className="mb-5" style={{ borderTop: "1px solid var(--border)" }} />

                {/* Content */}
                {s.content}
              </section>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <a
              href="/"
              className="text-[14px] transition-colors duration-150 hover:underline"
              style={{ color: "var(--text-3)" }}
            >
              ← Zurück zur Startseite
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
