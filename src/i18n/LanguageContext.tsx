import React, { createContext, useContext, useState, useEffect } from 'react';
import { id } from '../locales/id';
import { en } from '../locales/en';

type Language = 'id' | 'en';
type Currency = 'IDR' | 'USD';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (path: string) => string;
  formatPrice: (amountInUSD: number) => string;
  exchangeRate: number; // 1 USD = 16000 IDR
}

const dictionaries = { id, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auto-detect default locale from browser or localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kaevy_lang');
    if (saved === 'id' || saved === 'en') return saved;
    // Check navigator browser language
    if (typeof window !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('id')) return 'id';
    }
    return 'id'; // Default Indonesia First
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('kaevy_currency');
    if (saved === 'IDR' || saved === 'USD') return saved;
    return language === 'id' ? 'IDR' : 'USD';
  });

  const exchangeRate = 16000; // 1 USD = Rp 16.000

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kaevy_lang', lang);
    // Optionally sync default currency if user hasn't explicitly locked it
    if (!localStorage.getItem('kaevy_currency')) {
      const defaultCurr = lang === 'id' ? 'IDR' : 'USD';
      setCurrencyState(defaultCurr);
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('kaevy_currency', curr);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = dictionaries[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key missing in ID
        let fallback: any = dictionaries['en'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return fallback || path;
      }
    }
    return typeof current === 'string' ? current : path;
  };

  const formatPrice = (amountInUSD: number): string => {
    if (currency === 'IDR') {
      const amountInIDR = Math.round(amountInUSD * exchangeRate);
      return `Rp ${amountInIDR.toLocaleString('id-ID')}`;
    }
    return `$${amountInUSD.toLocaleString('en-US')}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatPrice,
        exchangeRate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
