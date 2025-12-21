import { useState, useEffect } from "react";
import { fetchColors, ColorDto } from "@/api/services/color";

export function useColors() {
    const [colors, setColors] = useState<ColorDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadColors = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchColors();
                setColors(data);
            } catch (e) {
                console.error("Failed to load colors:", e);
                setError("Impossible de charger les couleurs");
            } finally {
                setLoading(false);
            }
        };

        loadColors();
    }, []);

    return { colors, loading, error };
}