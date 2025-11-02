import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

type Language = 'en' | 'hi';
type Translations = Record<string, any>;
type TFunction = (key: string, options?: Record<string, any>) => string | React.ReactNode;


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TFunction;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { en, hi };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'hi' ? 'hi' : 'en');
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback<TFunction>((key, options) => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return key if not found
      }
    }

    if (typeof result === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        result = result.replace(`{{${optKey}}}`, options[optKey]);
      });
    }

    // FIX: A plain object from translations is not a valid ReactNode. Return key as fallback.
    if (typeof result === 'object' && result !== null && !React.isValidElement(result)) {
      return key;
    }

    return result;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);


  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};