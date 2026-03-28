"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
};

type CookieConsentContextType = {
  consent: CookieConsent | null;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  resetConsent: () => void;
};

const defaultValue: CookieConsentContextType = {
  consent: null,
  acceptAll: () => {},
  acceptNecessaryOnly: () => {},
  resetConsent: () => {},
};

const CookieConsentContext = createContext<CookieConsentContextType>(defaultValue);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cookieConsent");
      if (saved) {
        const parsed = JSON.parse(saved) as CookieConsent;
        setConsent(parsed);
      }
      // If nothing saved, consent stays null → Banner shows
    } catch {
      // If parsing fails, reset to null (banner shows)
      localStorage.removeItem("cookieConsent");
    }
    setIsMounted(true);
  }, []);

  const saveConsent = (value: CookieConsent) => {
    setConsent(value);
    try {
      localStorage.setItem("cookieConsent", JSON.stringify(value));
    } catch {
      // Fallback if localStorage is unavailable
    }
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true });
  };

  const acceptNecessaryOnly = () => {
    saveConsent({ necessary: true, analytics: false });
  };

  const resetConsent = () => {
    setConsent(null);
    try {
      localStorage.removeItem("cookieConsent");
    } catch {
      // Fallback if localStorage is unavailable
    }
  };

  // During SSR, consent is null, so banner won't show (no hydration issues)
  const value: CookieConsentContextType = {
    consent: isMounted ? consent : null,
    acceptAll,
    acceptNecessaryOnly,
    resetConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    return defaultValue;
  }
  return context;
}
