/**
 * Extrait un message d'erreur lisible depuis une exception
 * Compatible avec les erreurs Axios, Error standard, et objets inconnus
 */
export function extractErrorMessage(error: unknown): string {
    // Error standard JavaScript
    if (error instanceof Error) {
        return error.message;
    }

    // Erreur API (Axios)
    if (typeof error === "object" && error !== null) {
        const apiError = error as {
            response?: {
                data?: {
                    message?: string;
                    error?: string;
                };
            };
            message?: string;
        };

        // Priorité au message de l'API
        if (apiError.response?.data?.message) {
            return apiError.response.data.message;
        }

        if (apiError.response?.data?.error) {
            return apiError.response.data.error;
        }

        if (apiError.message) {
            return apiError.message;
        }
    }

    // Fallback par défaut
    return "Une erreur inattendue est survenue";
}