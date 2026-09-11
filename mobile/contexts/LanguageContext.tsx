import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "hi";

interface LanguageContextValue {
  lang: Language;
  isHi: boolean;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const t = (en: string, hi: string) => {
    return lang === "hi" ? hi : en;
  };

  return (
    <LanguageContext.Provider value={{ lang, isHi: lang === "hi", toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
