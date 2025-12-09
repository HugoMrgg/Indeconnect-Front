import { useState, useEffect } from "react";
import { brandsService } from "@/api/services/brands";
import { BrandDetailDTO } from "@/api/services/brands/types";

interface UseMyBrandReturn {
    brand: BrandDetailDTO | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useMyBrand(): UseMyBrandReturn {
    const [brand, setBrand] = useState<BrandDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBrand = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandsService.getMyBrand();
            setBrand(data);
        } catch (err) {
            console.error("Erreur chargement ma marque:", err);
            setError("Impossible de charger votre marque.");
            setBrand(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrand();
    }, []);

    return {
        brand,
        loading,
        error,
        refetch: fetchBrand  // Permet de recharger après sauvegarde
    };
}
