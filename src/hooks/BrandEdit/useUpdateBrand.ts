import { useState } from "react";
import { brandsService } from "@/api/services/brands";
import { UpdateBrandRequest } from "@/api/services/brands/types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface UseUpdateBrandReturn {
    updateBrand: (brandId: number, data: UpdateBrandRequest) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export function useUpdateBrand(): UseUpdateBrandReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateBrand = async (brandId: number, data: UpdateBrandRequest) => {
        try {
            setLoading(true);
            setError(null);

            await brandsService.updateBrand(brandId, data);

            toast.success("Marque mise à jour avec succès !", {
                icon: "✅",
                duration: 3000
            });
        } catch (err) {
            const message =
                err instanceof AxiosError
                    ? err.response?.data?.message || "Erreur lors de la mise à jour"
                    : err instanceof Error
                        ? err.message
                        : "Erreur lors de la mise à jour";

            setError(message);
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateBrand, loading, error };
}
