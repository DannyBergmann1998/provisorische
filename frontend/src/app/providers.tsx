"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DarkModeProvider } from "@/lib/dark-mode-context";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:   60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <DarkModeProvider>
      <CookieConsentProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <CookieBanner />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </CookieConsentProvider>
    </DarkModeProvider>
  );
}
