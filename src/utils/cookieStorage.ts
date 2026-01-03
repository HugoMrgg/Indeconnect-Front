/**
 * Utilitaire de gestion des cookies sécurisés
 * Remplace localStorage pour les données sensibles comme les tokens JWT
 */
import Cookies from 'js-cookie';
import { logger } from './logger';

interface CookieOptions {
  /**
   * Nombre de jours avant expiration
   * @default 7
   */
  expires?: number;

  /**
   * Chemin du cookie
   * @default '/'
   */
  path?: string;

  /**
   * Domaine du cookie
   * @default undefined (domaine actuel)
   */
  domain?: string;

  /**
   * Cookie sécurisé (HTTPS uniquement)
   * @default true en production, false en dev
   */
  secure?: boolean;

  /**
   * SameSite policy
   * @default 'strict'
   */
  sameSite?: 'strict' | 'lax' | 'none';
}

const DEFAULT_OPTIONS: CookieOptions = {
  expires: 7, // 7 jours
  path: '/',
  secure: import.meta.env.PROD, // true en production, false en dev
  sameSite: 'strict', // Protection CSRF
};

/**
 * Stocke une valeur dans un cookie sécurisé
 */
export function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
): void {
  try {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    Cookies.set(name, value, finalOptions);
  } catch (error) {
    logger.error('cookieStorage.setCookie', error);
  }
}

/**
 * Récupère une valeur depuis un cookie
 */
export function getCookie(name: string): string | undefined {
  try {
    return Cookies.get(name);
  } catch (error) {
    logger.error('cookieStorage.getCookie', error);
    return undefined;
  }
}

/**
 * Supprime un cookie
 */
export function removeCookie(name: string, options?: CookieOptions): void {
  try {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    Cookies.remove(name, finalOptions);
  } catch (error) {
    logger.error('cookieStorage.removeCookie', error);
  }
}

/**
 * Vérifie si un cookie existe
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== undefined;
}

/**
 * Supprime tous les cookies de l'application
 */
export function clearAllCookies(): void {
  try {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      // Ne supprimer que les cookies de notre app (ceux qui commencent par "indeconnect_")
      if (cookieName.startsWith('indeconnect_')) {
        Cookies.remove(cookieName);
      }
    });
  } catch (error) {
    logger.error('cookieStorage.clearAllCookies', error);
  }
}
