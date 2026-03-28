import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileText, Wrench, RefreshCw, DollarSign, Lock, AlertTriangle, Scale } from "lucide-react";

export const metadata: Metadata = { title: "AGB – Ankauf & Reparatur – Handy & PC Service" };

export default function AGBPage() {
  const sections = [
    {
      id: "geltungsbereich",
      title: "1. Geltungsbereich",
      icon: FileText,
      content: [
        "Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Danny Bergmann – handyundpcservice und seinen Kunden im Bereich Ankauf und Reparatur von elektronischen Geräten.",
      ],
    },
    {
      id: "vertragsgegenstand",
      title: "2. Vertragsgegenstand",
      icon: Wrench,
      content: [
        "Gegenstand des Vertrages ist:",
        "",
        "• der Ankauf von gebrauchten Geräten (z. B. Smartphones, PCs, Konsolen)",
        "• die Reparatur von elektronischen Geräten",
      ],
    },
    {
      id: "ankauf",
      title: "3. Ankauf von Geräten",
      icon: RefreshCw,
      content: [
        "(1) Der Kunde bietet ein Gerät zum Verkauf an.",
        "(2) Die Bewertung erfolgt anhand der Angaben des Kunden (Zustand, Modell etc.).",
        "(3) Nach Eingang und Prüfung des Geräts kann der endgültige Preis angepasst werden.",
        "",
        "(4) Falls das Gerät erheblich vom beschriebenen Zustand abweicht:",
        "",
        "• wird ein neuer Preis angeboten oder",
        "• das Gerät auf Wunsch zurückgesendet",
      ],
    },
    {
      id: "auszahlung",
      title: "4. Auszahlung",
      icon: DollarSign,
      content: [
        "(1) Die Auszahlung erfolgt per Überweisung oder nach Vereinbarung.",
        "(2) Die Auszahlung erfolgt erst nach Prüfung des Geräts.",
        "(3) Es besteht kein Anspruch auf Auszahlung vor erfolgreicher Prüfung.",
      ],
    },
    {
      id: "eigentumsrecht",
      title: "5. Eigentum und Herkunft",
      icon: Lock,
      content: [
        "(1) Der Kunde versichert, dass:",
        "",
        "• er rechtmäßiger Eigentümer des Geräts ist",
        "• das Gerät frei von Rechten Dritter ist",
        "• das Gerät nicht gestohlen ist",
        "",
        "(2) Bei Verdacht auf Diebstahl behalten wir uns vor:",
        "",
        "• die Auszahlung zu verweigern",
        "• Behörden einzuschalten",
      ],
    },
    {
      id: "versand",
      title: "6. Versand und Risiko",
      icon: AlertTriangle,
      content: [
        "(1) Der Versand erfolgt auf Risiko des Kunden, sofern nichts anderes vereinbart wurde.",
        "(2) Für Transportschäden wird keine Haftung übernommen, sofern kein versicherter Versand gewählt wurde.",
      ],
    },
    {
      id: "reparaturen",
      title: "7. Reparaturen",
      icon: Wrench,
      content: [
        "(1) Reparaturen werden nach bestem Wissen und Gewissen durchgeführt.",
        "(2) Es kann nicht garantiert werden, dass eine Reparatur in jedem Fall erfolgreich ist.",
        "(3) Bei Folgeschäden an bereits defekten Geräten wird keine Haftung übernommen.",
      ],
    },
    {
      id: "gewaehrleistung",
      title: "8. Gewährleistung",
      icon: Lock,
      content: [
        "(1) Für Reparaturen gilt die gesetzliche Gewährleistung.",
        "(2) Keine Gewährleistung besteht für:",
        "",
        "• bereits vorhandene Schäden",
        "• Softwareprobleme, die nicht Bestandteil der Reparatur waren",
      ],
    },
    {
      id: "haftung",
      title: "9. Haftung",
      icon: AlertTriangle,
      content: [
        "(1) Wir haften nur für Vorsatz und grobe Fahrlässigkeit.",
        "(2) Für Datenverlust wird keine Haftung übernommen.",
        "",
        "Der Kunde ist selbst für Datensicherung verantwortlich.",
      ],
    },
    {
      id: "datenschutz",
      title: "10. Datenschutz",
      icon: Lock,
      content: [
        "Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung.",
      ],
    },
    {
      id: "schlussbestimmungen",
      title: "11. Schlussbestimmungen",
      icon: Scale,
      content: [
        "(1) Es gilt das Recht der Bundesrepublik Deutschland.",
        "(2) Sollten einzelne Bestimmungen unwirksam sein, bleibt der Rest der AGB unberührt.",
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
              <h1 className="text-4xl md:text-5xl font-black text-white">AGB</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Allgemeine Geschäftsbedingungen für Ankauf und Reparatur von elektronischen Geräten.
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
                  {title.split(". ")[0]}
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
                    <p key={i} className={line === "" ? "h-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-700">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Scale size={18} className="text-primary-400" />
                Rechtliche Bindung
              </h3>
              <p className="text-slate-400 text-sm">
                Diese AGB gelten für alle Ankauf- und Reparaturverträge mit handyundpcservice. Durch die Nutzung unserer Services erklärst du dich mit diesen Bedingungen einverstanden.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
