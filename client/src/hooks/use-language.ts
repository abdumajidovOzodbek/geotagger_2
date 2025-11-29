import { useContext } from 'react';
import { LanguageContext } from '@/contexts/language-context';
import { getTranslation, type TranslationKey } from '@/lib/translations';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return {
    language: context.language,
    setLanguage: context.setLanguage,
    t: (key: TranslationKey) => getTranslation(context.language, key),
  };
}
