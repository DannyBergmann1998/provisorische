import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Handy & PC Service – Schnelle Reparaturen. Faire Preise.",
  description:
    "Professioneller Reparaturservice für Smartphones, PCs und Laptops. Persönlich, transparent und zuverlässig.",
  keywords: [
    "Handy Reparatur",
    "PC Reparatur",
    "Laptop Reparatur",
    "Smartphone Display tauschen",
    "Akku wechseln",
  ],
  authors:    [{ name: "Handy & PC Service" }],
  robots:     "index, follow",
  icons: {
    icon:             "/logo.png",
    apple:            "/logo.png",
    shortcut:         "/logo.png",
  },
  openGraph: {
    type:        "website",
    locale:      "de_DE",
    siteName:    "Handy & PC Service",
    title:       "Handy & PC Service – Schnelle Reparaturen. Faire Preise.",
    description: "Professioneller Reparaturservice für Smartphones, PCs und Laptops.",
    images:      [{ url: "/logo.png", width: 321, height: 321 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width:      "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100;0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
