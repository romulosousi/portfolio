import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/types";
import type { Translations } from "./types";
import { pt } from "./pt";
import { en } from "./en";

const DICTS: Record<Lang, Translations> = { pt, en };

const STORAGE_KEY = "portfolio.lang";

interface I18nContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nContextValue>({
  lang: "pt",
  t: pt,
  setLang: () => {},
});

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "pt";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "pt" || stored === "en") return stored;
  } catch {
    /* localStorage may be unavailable (private mode, etc.) */
  }
  const browser = window.navigator.language?.toLowerCase() ?? "";
  return browser.startsWith("pt") ? "pt" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, t: DICTS[lang], setLang }),
    [lang, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
