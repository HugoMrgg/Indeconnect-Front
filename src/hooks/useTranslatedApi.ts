import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Hook personnalisé pour gérer les appels API avec la langue actuelle
 *
 * Usage :
 * ```tsx
 * const { currentLanguage, addLangParam, buildUrl } = useTranslatedApi();
 *
 * // Ajouter le paramètre lang à un objet de params
 * const params = addLangParam({ search: 'test' }); // { search: 'test', lang: 'fr' }
 *
 * // Construire une URL avec le paramètre lang
 * const url = buildUrl('/api/products'); // '/api/products?lang=fr'
 * const url2 = buildUrl('/api/products?page=1'); // '/api/products?page=1&lang=fr'
 * ```
 */
export const useTranslatedApi = () => {
  const { i18n } = useTranslation();

  // Langue actuelle (fr, nl, de, en)
  const currentLanguage = i18n.language;

  /**
   * Ajoute le paramètre lang à un objet de paramètres
   */
  const addLangParam = useMemo(
    () => (params: Record<string, unknown> = {}) => {
      return {
        ...params,
        lang: currentLanguage,
      };
    },
    [currentLanguage]
  );

  /**
   * Construit une URL en ajoutant automatiquement le paramètre lang
   */
  const buildUrl = useMemo(
    () => (baseUrl: string, params: Record<string, unknown> = {}) => {
      const allParams = addLangParam(params);
      const url = new URL(baseUrl, window.location.origin);

      // Ajouter tous les paramètres à l'URL
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });

      // Retourner seulement le pathname + search
      return url.pathname + url.search;
    },
    [addLangParam]
  );

  /**
   * Fonction helper pour créer des options de requête avec lang
   */
  const createRequestConfig = useMemo(
    () => (config: { params?: Record<string, unknown> } = {}) => {
      return {
        ...config,
        params: addLangParam(config.params),
      };
    },
    [addLangParam]
  );

  return {
    currentLanguage,
    addLangParam,
    buildUrl,
    createRequestConfig,
  };
};

/**
 * Fonction utilitaire standalone pour ajouter le paramètre lang à une URL
 * Utile pour les endroits où on ne peut pas utiliser de hook
 */
export const addLangToUrl = (url: string, lang: string): string => {
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set('lang', lang);
  return urlObj.pathname + urlObj.search;
};
