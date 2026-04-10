import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Handy & PC Service – Professionelle Reparaturen",
  description:
    "Professioneller Reparaturservice für Smartphones, PCs, Laptops und Apple Geräte. Schnell, transparent, zuverlässig.",
  keywords: [
    "Handy Reparatur",
    "PC Reparatur",
    "Laptop Reparatur",
    "Apple Reparatur",
    "Konsolen Reparatur",
    "iPhone Display",
    "Akku tauschen",
  ],
  authors: [{ name: "Handy & PC Service" }],
  robots:  "index, follow",
  icons: {
    icon:     "/logo.png",
    apple:    "/logo.png",
    shortcut: "/logo.png",
  },
  openGraph: {
    type:        "website",
    locale:      "de_DE",
    siteName:    "Handy & PC Service",
    title:       "Handy & PC Service – Professionelle Reparaturen",
    description: "Schnell, transparent, zuverlässig.",
    images:      [{ url: "/logo.png", width: 321, height: 321 }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width:        "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply stored theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100;0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
