import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Shield, Mail, Phone, MapPin, FileText, AlertCircle, Copyright } from "lucide-react";

export const metadata: Metadata = { title: "Impressum – Handy & PC Service" };

export default function ImpressumPage() {
  const sections = [
    {
      id: "tmg",
      title: "Angaben gemäß § 5 TMG",
      icon: FileText,
      content: [
        "Danny Bergmann",
        "handyundpcservice",
        "Grömitzer Straße 4",
        "23730 Schashagen",
        "Deutschland",
        "",
        "Telefon: 017668917854",
        "E-Mail: info@handyundpcservice.de",
      ],
    },
    {
      id: "rstv",
      title: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
      icon: Shield,
      content: [
        "Danny Bergmann",
        "Grömitzer Straße 4",
        "23730 Schashagen",
      ],
    },
    {
      id: "streitbeilegung",
      title: "EU-Streitschlichtung",
      icon: AlertCircle,
      content: [
        "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:",
        "https://ec.europa.eu/consumers/odr/",
        "",
        "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    },
    {
      id: "haftung-inhalte",
      title: "Haftung für Inhalte",
      icon: FileText,
      content: [
        "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
        "",
        "Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      ],
    },
    {
      id: "haftung-links",
      title: "Haftung für Links",
      icon: MapPin,
      content: [
        "Unsere Website enthält Links zu externen Websites Dritter.",
        "",
        "Auf deren Inhalte haben wir keinen Einfluss. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.",
      ],
    },
    {
      id: "urheberrecht",
      title: "Urheberrecht",
      icon: Copyright,
      content: [
        "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.",
        "",
        "Vervielfältigung, Bearbeitung und Verbreitung bedürfen der schriftlichen Zustimmung des jeweiligen Autors.",
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={32} className="text-primary-400" />
              <h1 className="text-4xl md:text-5xl font-black text-white">Impressum</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Alle erforderlichen rechtlichen Angaben und Informationen über unser Unternehmen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sections.map(({ id, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-sm px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-primary-400 hover:border-primary-500/50 transition-colors"
                >
                  {title.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-12">
            {sections.map(({ id, title, icon: Icon, content }) => (
              <section key={id} id={id} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary-500/10 rounded-lg flex-shrink-0 mt-1">
                    <Icon size={24} className="text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white">{title}</h2>
                </div>
                <div className="ml-16 space-y-2 text-slate-400">
                  {content.map((line, i) => (
                    <div key={i}>
                      {line.startsWith("http") ? (
                        <a
                          href={line}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 hover:text-primary-300 transition-colors break-all"
                        >
                          {line}
                        </a>
                      ) : (
                        <p className={line === "" ? "h-2" : ""}>
                          {line}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-700">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Shield size={18} className="text-primary-400" />
                Rechtliche Sicherheit
              </h3>
              <p className="text-slate-400 text-sm">
                Alle Angaben nach deutschem Telemediengesetz (TMG) und Rundfunkstaatsvertrag (RStV). Kontaktiere uns bei weiteren Fragen.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
