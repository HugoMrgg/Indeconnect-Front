import { useState, useEffect } from "react";
import { ethicsService } from "@/api/services/ethicsService";

interface EthicTag {
    key: string;
    label: string;
    description?: string;
    brandCount: number;
}

export const useEthicTags = () => {
    const [tags, setTags] = useState<EthicTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await ethicsService.getEthicTags();
                setTags(response.tags ?? []); // response = { tags: [...] }
                setError(null);
            } catch (err) {
                console.error("Erreur chargement tags éthiques:", err);
                setError("Impossible de charger les tags éthiques.");
                setTags([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []); // Pas de dépendances, charge une seule fois au montage

    return { tags, loading, error };
};
