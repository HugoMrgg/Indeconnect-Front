import { useState, useEffect } from "react";
import { fetchSizesByCategory, SizeDto } from "@/api/services/sizes";

export function useSizes(categoryId: number | null) {
    const [sizes, setSizes] = useState<SizeDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (categoryId === null) {
            setSizes([]);
            setLoading(false);
            return;
        }

        const loadSizes = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchSizesByCategory(categoryId);
                setSizes(data);
            } catch (e) {
                console.error("Failed to load sizes:", e);
                setError("Impossible de charger les tailles");
                setSizes([]);
            } finally {
                setLoading(false);
            }
        };

        loadSizes();
    }, [categoryId]);

    return { sizes, loading, error };
}