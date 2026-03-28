import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default:  "Handy & PC Service – Reparatur, Ankauf & Shop",
    template: "%s | Handy & PC Service",
  },
  description:
    "Professionelle Reparatur für Handys, PCs und Konsolen. Ankauf gebrauchter Geräte. Online-Shop für Smartphones und Zubehör. Schnell, günstig, zuverlässig.",
  keywords:   ["Handy Reparatur", "PC Reparatur", "Smartphone Ankauf", "iPhone Reparatur", "Samsung Reparatur"],
  authors:    [{ name: "Handy & PC Service" }],
  robots:     "index, follow",
  openGraph: {
    type:        "website",
    locale:      "de_DE",
    siteName:    "Handy & PC Service",
    title:       "Handy & PC Service",
    description: "Professionelle Reparatur, Ankauf und Online-Shop",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width:      "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0A0A0A] text-black dark:text-white overflow-x-hidden transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
