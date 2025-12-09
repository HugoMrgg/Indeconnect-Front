import { useState, useCallback } from "react";

interface GeolocationPosition {
    lat: number;
    lon: number;
}

export function useGeolocation() {
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    /**
     * Demande la permission et récupère la position GPS
     */
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par ce navigateur.");
            setHasPermission(false);
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
                setHasPermission(true);
                setLoading(false);
            },
            (err) => {
                let errorMessage = "Erreur de géolocalisation";

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = "Permission refusée. Autorisez la localisation dans les paramètres.";
                        setHasPermission(false);
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = "Position indisponible.";
                        break;
                    case err.TIMEOUT:
                        errorMessage = "Délai d'attente dépassé.";
                        break;
                }

                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    /**
     * Réinitialise la position GPS
     */
    const clearLocation = useCallback(() => {
        setPosition(null);
        setError(null);
        setHasPermission(null);
    }, []);

    return {
        position,
        loading,
        error,
        hasPermission,
        requestLocation,
        clearLocation,
    };
}
