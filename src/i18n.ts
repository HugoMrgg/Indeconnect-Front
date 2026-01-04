import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import frTranslations from './locales/fr.json';
import nlTranslations from './locales/nl.json';
import deTranslations from './locales/de.json';
import enTranslations from './locales/en.json';

// Clé de stockage pour localStorage
const LANGUAGE_STORAGE_KEY = 'indeconnect-language';

// Configuration de i18next
i18n
  // Détection automatique de la langue
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation avec les options
  .init({
    // Ressources de traduction
    resources: {
      fr: {
        translation: frTranslations,
      },
      nl: {
        translation: nlTranslations,
      },
      de: {
        translation: deTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },

    // Langue par défaut si aucune détection
    fallbackLng: 'fr',

    // Langues supportées
    supportedLngs: ['fr', 'nl', 'de', 'en'],

    // Debug en développement uniquement
    debug: import.meta.env.DEV,

    // Interpolation par défaut
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },

    // Configuration de la détection de langue
    detection: {
      // Ordre de détection
      order: ['localStorage', 'navigator'],

      // Clé de stockage localStorage
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,

      // Cache la langue détectée
      caches: ['localStorage'],

      // Ne pas utiliser de cookie
      lookupCookie: undefined,
    },

    // Ne pas charger de namespace
    defaultNS: 'translation',
    ns: ['translation'],

    // Compatible avec React Suspense
    react: {
      useSuspense: false, // Désactivé pour éviter les problèmes de rendu
    },
  });

// Fonction helper pour changer de langue
export const changeLanguage = async (lang: string): Promise<void> => {
  await i18n.changeLanguage(lang);
};

// Fonction helper pour obtenir la langue actuelle
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Export par défaut de l'instance i18n
export default i18n;
