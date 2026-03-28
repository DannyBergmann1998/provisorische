"use client";

import Script from "next/script";
import { useCookieConsent } from "@/lib/cookie-consent-context";

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const { consent } = useCookieConsent();

  // Do not load GA if:
  // 1. No GA ID is provided
  // 2. Consent is not given (null or analytics is false)
  if (!gaId || !consent || !consent.analytics) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
