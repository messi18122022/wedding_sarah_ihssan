"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang, T, translations } from "../i18n/translations";

type CtxValue = { lang: Lang; setLang: (l: Lang) => void; t: T };

const LanguageContext = createContext<CtxValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
