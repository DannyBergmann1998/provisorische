import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Shield, Mail, Phone, Lock, Eye, Trash2 } from "lucide-react";

export const metadata: Metadata = { title: "Datenschutzerklärung – Handy & PC Service" };

export default function DatenschutzPage() {
  const sections = [
    {
      id: "verantwortlicher",
      title: "1. Verantwortlicher",
      icon: Shield,
      content: [
        "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
        "",
        "Danny Bergmann",
        "handyundpcservice",
        "Telefon: 017668917854",
        "E-Mail: info@handyundpcservice.de",
      ],
    },
    {
      id: "datenerhebung",
      title: "2. Erhebung und Speicherung personenbezogener Daten beim Besuch der Website",
      icon: Eye,
      content: [
        "Beim Aufrufen dieser Website werden automatisch Informationen durch den Hosting-Anbieter erfasst und in sogenannten Server-Logfiles gespeichert. Dazu gehören:",
        "",
        "• IP-Adresse",
        "• Datum und Uhrzeit der Anfrage",
        "• Browsertyp und Version",
        "• Betriebssystem",
        "• Referrer-URL",
        "",
        "Diese Daten dienen ausschließlich der Sicherstellung eines störungsfreien Betriebs der Website.",
        "",
        "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO",
      ],
    },
    {
      id: "kontakt",
      title: "3. Kontaktaufnahme",
      icon: Mail,
      content: [
        "Wenn du uns per E-Mail oder Kontaktformular kontaktierst, werden deine Angaben zur Bearbeitung deiner Anfrage gespeichert.",
        "",
        "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO",
      ],
    },
    {
      id: "kundendaten",
      title: "4. Verarbeitung von Kundendaten (Ankauf / Reparatur)",
      icon: Lock,
      content: [
        "Im Rahmen unserer Dienstleistungen verarbeiten wir folgende Daten:",
        "",
        "• Name",
        "• Telefonnummer",
        "• E-Mail-Adresse",
        "• Gerätedaten (z. B. Modell, IMEI, Zustand)",
        "",
        "Diese Daten sind zur Vertragserfüllung erforderlich.",
        "",
        "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO",
      ],
    },
    {
      id: "hosting",
      title: "5. Hosting",
      icon: Shield,
      content: [
        "Diese Website wird bei einem externen Hosting-Anbieter betrieben. Dabei können personenbezogene Daten auf den Servern des Anbieters verarbeitet werden.",
        "",
        "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies",
      icon: Lock,
      content: [
        "Diese Website verwendet technisch notwendige Cookies zur Sicherstellung der Funktionalität.",
      ],
    },
    {
      id: "rechte",
      title: "7. Deine Rechte",
      icon: Eye,
      content: [
        "Du hast das Recht auf:",
        "",
        "• Auskunft (Art. 15 DSGVO)",
        "• Berichtigung (Art. 16 DSGVO)",
        "• Löschung (Art. 17 DSGVO)",
        "• Einschränkung (Art. 18 DSGVO)",
        "• Widerspruch (Art. 21 DSGVO)",
      ],
    },
    {
      id: "kontakt-datenschutz",
      title: "8. Kontakt Datenschutz",
      icon: Mail,
      content: [
        "Bei Fragen kannst du dich an uns wenden:",
        "",
        "E-Mail: info@handyundpcservice.de",
      ],
    },
    {
      id: "ssl",
      title: "9. SSL- bzw. TLS-Verschlüsselung",
      icon: Shield,
      content: [
        "Diese Website nutzt SSL- bzw. TLS-Verschlüsselung zur Sicherung aller Datenübertragungen.",
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
              <Shield size={32} className="text-primary-400" />
              <h1 className="text-4xl md:text-5xl font-black text-white">Datenschutzerklärung</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Wir nehmen deinen Datenschutz ernst. Diese Erklärung informiert dich darüber, wie wir deine persönlichen Daten verarbeiten.
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
                <Shield size={18} className="text-primary-400" />
                Deine Daten sind sicher
              </h3>
              <p className="text-slate-400 text-sm">
                Wir verwenden modernste Sicherheitsmaßnahmen zum Schutz deiner Daten. Solltest du noch Fragen haben, kontaktiere uns gerne jederzeit.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
