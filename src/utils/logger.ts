/**
 * Logger utility pour remplacer les console.* et éviter la pollution en production
 * En production, les logs peuvent être envoyés vers un service de monitoring (Sentry, LogRocket, etc.)
 */

import { captureError, captureMessage } from './sentry';

type LogLevel = 'info' | 'warn' | 'error';

interface LoggerConfig {
  isDevelopment: boolean;
  enableInfoInProduction?: boolean;
  onError?: (context: string, error: unknown) => void;
}

class Logger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      isDevelopment: import.meta.env.DEV,
      enableInfoInProduction: false,
      ...config,
    };
  }

  /**
   * Log un message d'information
   * En production, ces logs sont ignorés par défaut (sauf si enableInfoInProduction = true)
   */
  info(context: string, message: unknown): void {
    if (!this.config.isDevelopment && !this.config.enableInfoInProduction) {
      return;
    }

    this.log('info', context, message);
  }

  /**
   * Log un warning
   * Affiché en dev, peut être envoyé vers un service de monitoring en prod
   */
  warn(context: string, message: unknown): void {
    this.log('warn', context, message);

    // En production, envoyer vers un service de monitoring si configuré
    if (!this.config.isDevelopment) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      captureMessage(`[${context}] ${messageStr}`, 'warning');
    }
  }

  /**
   * Log une erreur
   * Toujours affiché et peut être envoyé vers un service de monitoring
   */
  error(context: string, error: unknown): void {
    this.log('error', context, error);

    // En production, envoyer vers un service de monitoring
    if (!this.config.isDevelopment) {
      if (this.config.onError) {
        this.config.onError(context, error);
      }

      captureError(error, { context });
    }
  }

  /**
   * Méthode privée pour effectuer le log
   */
  private log(level: LogLevel, context: string, message: unknown): void {
    const prefix = `[${context}]`;
    const timestamp = new Date().toISOString();

    switch (level) {
      case 'info':
        console.info(`${timestamp} ${prefix}`, message);
        break;
      case 'warn':
        console.warn(`${timestamp} ${prefix}`, message);
        break;
      case 'error':
        console.error(`${timestamp} ${prefix}`, message);
        break;
    }
  }

  /**
   * Configure le logger (utile pour les tests ou pour activer/désactiver certaines fonctionnalités)
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Instance singleton du logger
export const logger = new Logger();

// Export de la classe pour les tests ou configurations personnalisées
export { Logger };
