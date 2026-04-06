import { Metadata } from "next";
import { Navbar }   from "@/components/ui/Navbar";
import { Footer }   from "@/sections/Footer";

export const metadata: Metadata = {
  title:  "Datenschutzerklärung – Handy & PC Service",
  robots: "noindex",
};

const sections = [
  {
    id:    "allgemein",
    label: "01",
    title: "Allgemeine Hinweise",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung
        informiert Sie darüber, welche Daten wir erheben und wie wir sie verwenden.
      </p>
    ),
  },
  {
    id:    "datenerfassung",
    label: "02",
    title: "Datenerfassung auf dieser Website",
    content: (
      <div className="space-y-4">
        <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>
          Server-Log-Dateien
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in
          sogenannten Server-Log-Dateien. Dies sind:
        </p>
        <ul className="space-y-2 pl-4" style={{ borderLeft: "2px solid var(--border-2)" }}>
          {[
            "Browsertyp und Browserversion",
            "Verwendetes Betriebssystem",
            "Referrer URL",
            "Hostname des zugreifenden Rechners",
            "Uhrzeit der Serveranfrage",
            "IP-Adresse",
          ].map((item) => (
            <li
              key={item}
              className="text-[14px] pl-4"
              style={{ color: "var(--text-2)" }}
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-3)" }}>
          Diese Daten sind nicht bestimmten Personen zuordenbar.
        </p>
      </div>
    ),
  },
  {
    id:    "kontakt",
    label: "03",
    title: "Kontaktaufnahme",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Wenn Sie uns per Telefon oder E-Mail kontaktieren, werden Ihre Angaben zur
        Bearbeitung der Anfrage gespeichert.
      </p>
    ),
  },
  {
    id:    "cookies",
    label: "04",
    title: "Cookies",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Diese Website kann Cookies verwenden. Cookies richten auf Ihrem Rechner keinen
        Schaden an und enthalten keine Viren.
      </p>
    ),
  },
  {
    id:    "rechte",
    label: "05",
    title: "Ihre Rechte",
    content: (
      <div className="space-y-3">
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          Sie haben jederzeit das Recht auf:
        </p>
        <ul className="space-y-2 pl-4" style={{ borderLeft: "2px solid var(--border-2)" }}>
          {[
            "Auskunft über Ihre gespeicherten Daten",
            "Berichtigung oder Löschung",
            "Einschränkung der Verarbeitung",
          ].map((item) => (
            <li
              key={item}
              className="text-[14px] pl-4"
              style={{ color: "var(--text-2)" }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id:    "hosting",
    label: "06",
    title: "Hosting",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Die Website wird bei einem externen Dienstleister gehostet. Personenbezogene
        Daten werden auf den Servern des Hosters gespeichert.
      </p>
    ),
  },
  {
    id:    "ssl",
    label: "07",
    title: "SSL-/TLS-Verschlüsselung",
    content: (
      <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-2)" }}>
        Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung.
      </p>
    ),
  },
];

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">

          {/* Header */}
          <div className="mb-16">
            <p className="text-label mb-4" style={{ color: "var(--text-3)" }}>
              Rechtliches
            </p>
            <h1 className="text-heading" style={{ color: "var(--text)" }}>
              Datenschutz&shy;erklärung
            </h1>
            <p className="mt-3 text-[14px]" style={{ color: "var(--text-3)" }}>
              Stand: April 2026
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded flex-shrink-0"
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

                <div className="mb-5" style={{ borderTop: "1px solid var(--border)" }} />

                {s.content}
              </section>
            ))}
          </div>

          {/* Contact note */}
          <div
            className="mt-12 rounded-2xl p-6"
            style={{
              background: "var(--surface)",
              border:     "1px solid var(--border)",
            }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>
              Bei Fragen zum Datenschutz wenden Sie sich an:{" "}
              <a
                href="mailto:handyundpcservice@gmail.com"
                className="hover:underline transition-colors"
                style={{ color: "var(--accent)" }}
              >
                handyundpcservice@gmail.com
              </a>
            </p>
          </div>

          {/* Back link */}
          <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
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
