import { useEffect, useState } from "react";
import { Brand } from "@/types/brand";
import { fetchBrands, BrandsResponse } from "@/api/brandsApi";

export function useBrands() {
    const [brandsNearby, setBrandsNearby] = useState<Brand[]>([]);
    const [ethicalBrands, setEthicalBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBrands = async () => {
            try {
                setLoading(true);
                const data: BrandsResponse = await fetchBrands();
                setBrandsNearby(data.nearby);
                setEthicalBrands(data.ethical);
            } catch (err) {
                setError("Impossible de charger les marques.");
            } finally {
                setLoading(false);
            }
        };

        loadBrands();
    }, []);

    return { brandsNearby, ethicalBrands, loading, error };
}
