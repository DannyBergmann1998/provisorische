"use client";

import { DarkModeProvider } from "@/lib/dark-mode-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CookieBanner } from "@/components/ui/CookieBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <CookieConsentProvider>
        {children}
        <CookieBanner />
      </CookieConsentProvider>
    </DarkModeProvider>
  );
}
