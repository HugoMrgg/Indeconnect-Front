import * as Sentry from '@sentry/react';

/**
 * Configuration de Sentry pour le monitoring des erreurs en production
 */

export const initSentry = (): void => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const isDevelopment = import.meta.env.DEV;

  // Ne pas initialiser Sentry en développement ou si le DSN n'est pas configuré
  if (isDevelopment || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Taux d'échantillonnage des performances (0.0 à 1.0)
    // 1.0 = 100% des transactions sont envoyées
    tracesSampleRate: 0.1,

    // Taux d'échantillonnage des replays de session
    // Utile pour déboguer les erreurs en voyant ce que l'utilisateur a fait
    replaysSessionSampleRate: 0.1, // 10% des sessions
    replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreur

    // Environnement (production, staging, etc.)
    environment: import.meta.env.MODE,

    // Filtrer les erreurs non pertinentes
    beforeSend(event, hint) {
      // Ignorer les erreurs réseau qui sont souvent temporaires
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message);
        if (
          message.includes('NetworkError') ||
          message.includes('Failed to fetch')
        ) {
          return null;
        }
      }
      return event;
    },
  });
};

/**
 * Capture une erreur manuellement dans Sentry
 */
export const captureError = (error: unknown, context?: Record<string, unknown>): void => {
  if (import.meta.env.DEV) {
    return;
  }

  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Capture un message manuel dans Sentry (pour les warnings par exemple)
 */
export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
): void => {
  if (import.meta.env.DEV) {
    return;
  }

  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureMessage(message, level);
    });
  } else {
    Sentry.captureMessage(message, level);
  }
};

/**
 * Définir l'utilisateur actuel pour le contexte Sentry
 */
export const setUser = (user: { id: string; email?: string; username?: string } | null): void => {
  if (import.meta.env.DEV) {
    return;
  }

  Sentry.setUser(user);
};
