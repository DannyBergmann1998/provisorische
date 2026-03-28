import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileText, AlertCircle, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "Widerrufsbelehrung – Handy & PC Service" };

export default function WiderrufsbelehrungPage() {
  const sections = [
    {
      id: "reparatur",
      title: "1. Widerrufsrecht bei Reparaturdienstleistungen",
      icon: FileText,
      content: [
        "Verbraucher haben grundsätzlich das Recht, einen Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen.",
        "",
        "Das Widerrufsrecht erlischt jedoch vorzeitig, wenn:",
        "",
        "• die Ausführung der Dienstleistung (Reparatur) bereits begonnen wurde und",
        "• der Kunde ausdrücklich zugestimmt hat, dass mit der Ausführung vor Ablauf der Widerrufsfrist begonnen wird.",
        "",
        "Sobald die Reparatur begonnen wurde, besteht kein Widerrufsrecht mehr.",
        "",
        "Vor Beginn der Reparatur kann der Auftrag jederzeit storniert werden.",
      ],
    },
    {
      id: "ankauf",
      title: "2. Widerrufsrecht beim Ankauf von Geräten",
      icon: AlertCircle,
      content: [
        "Beim Ankauf von Geräten (Verkauf des Kunden an uns) handelt es sich nicht um einen klassischen Verbrauchervertrag.",
        "",
        "Ein gesetzliches Widerrufsrecht besteht hier grundsätzlich nicht.",
        "",
        "Eine Stornierung ist jedoch möglich, solange:",
        "",
        "• das Gerät noch nicht geprüft wurde oder",
        "• noch kein endgültiger Kaufpreis bestätigt wurde",
        "",
        "Nach Abschluss des Ankaufprozesses ist ein Widerruf ausgeschlossen.",
      ],
    },
    {
      id: "warenkauf",
      title: "3. Widerrufsrecht bei Warenkäufen (Online-Shop)",
      icon: FileText,
      content: [
        "Wenn über die Website Waren gekauft werden (z. B. Zubehör), gilt:",
        "",
        "Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen den Vertrag zu widerrufen.",
        "",
        "Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem die Ware erhalten wurde.",
        "",
        "Zur Ausübung des Widerrufsrechts muss der Kunde uns kontaktieren:",
      ],
    },
    {
      id: "kontakt",
      title: "Kontaktinformationen",
      icon: Mail,
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
      id: "folgen",
      title: "4. Folgen des Widerrufs",
      icon: AlertCircle,
      content: [
        "Im Falle eines Widerrufs werden alle Zahlungen unverzüglich zurückerstattet.",
        "",
        "Die Rückzahlung erfolgt über dasselbe Zahlungsmittel.",
        "",
        "Der Kunde trägt die Kosten der Rücksendung, sofern nichts anderes vereinbart wurde.",
      ],
    },
    {
      id: "ausschluss",
      title: "5. Ausschluss bzw. Erlöschen des Widerrufsrechts",
      icon: AlertCircle,
      content: [
        "Das Widerrufsrecht erlischt:",
        "",
        "• bei vollständig erbrachten Dienstleistungen",
        "• bei individuell angepassten Leistungen",
        "• wenn der Kunde ausdrücklich der sofortigen Ausführung zugestimmt hat",
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
              <h1 className="text-4xl md:text-5xl font-black text-white">Widerrufsbelehrung</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Informationen zu deinen Widerrufsrechten bei Reparaturen, Ankauf und Online-Käufen.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sections.slice(0, 5).map(({ id, title }) => (
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
                {id !== "kontakt" ? (
                  <>
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
                  </>
                ) : (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-2">
                    {content.map((line, i) => (
                      <div key={i} className={line === "" ? "h-2" : ""}>
                        {line.startsWith("Telefon:") || line.startsWith("E-Mail:") ? (
                          <div className="text-slate-400 flex items-center gap-2">
                            {line.startsWith("Telefon:") && <Phone size={16} className="text-primary-400 flex-shrink-0" />}
                            {line.startsWith("E-Mail:") && <Mail size={16} className="text-primary-400 flex-shrink-0" />}
                            {line.startsWith("E-Mail:") ? (
                              <>
                                E-Mail:{" "}
                                <a href="mailto:info@handyundpcservice.de" className="text-primary-400 hover:text-primary-300">
                                  info@handyundpcservice.de
                                </a>
                              </>
                            ) : (
                              line
                            )}
                          </div>
                        ) : (
                          <p className="text-white font-medium">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16 pt-16 border-t border-slate-700">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-primary-400" />
                Wichtige Hinweise
              </h3>
              <p className="text-slate-400 text-sm">
                Diese Widerrufsbelehrung gilt für alle Dienstleistungen und Produkte von handyundpcservice. Fragen zum Widerrufsrecht? Kontaktiere uns gerne jederzeit.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
