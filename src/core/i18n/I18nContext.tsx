import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.docs': 'Documentation',
    'nav.contact': 'Contact',
    'hero.title': 'The Next Generation of Institutional Intelligence.',
    'hero.subtitle': 'Enterprise ERP solution with Galaxy AI integration, automated operations, and real-time analytics for modern schools.',
    'cta.getStarted': 'Get Started',
    'cta.bookDemo': 'Book Live Demo'
  },
  hi: {
    'nav.home': 'होम',
    'nav.features': 'विशेषताएं',
    'nav.pricing': 'कीमतें',
    'nav.docs': 'दस्तावेज़',
    'nav.contact': 'संपर्क',
    'hero.title': 'संस्थागत बुद्धिमत्ता की अगली पीढ़ी।',
    'hero.subtitle': 'आधुनिक स्कूलों के लिए गैलेक्सी एआई एकीकरण, स्वचालित संचालन और वास्तविक समय विश्लेषण के साथ एंटरप्राइज ईआरपी समाधान।',
    'cta.getStarted': 'शुरू करें',
    'cta.bookDemo': 'डेमो बुक करें'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used within I18nProvider');
  return context;
};
