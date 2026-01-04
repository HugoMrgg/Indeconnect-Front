import { useState, useEffect } from "react";
import { fetchCategories, CategoryDto } from "@/api/services/categories";

export function useCategories() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (e) {
                console.error("Failed to load Categories:", e);
                setError("Impossible de charger les catégories");
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading, error };
}
