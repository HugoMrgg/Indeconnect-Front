import { useState } from "react";
import { brandsService } from "@/api/services/brands";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface UseBrandModerationReturn {
    approving: boolean;
    rejecting: boolean;
    approveBrand: (brandId: number) => Promise<boolean>;
    rejectBrand: (brandId: number, reason: string) => Promise<boolean>;
}

export function useBrandModeration(): UseBrandModerationReturn {
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const queryClient = useQueryClient();

    const approveBrand = async (brandId: number): Promise<boolean> => {
        try {
            setApproving(true);
            await brandsService.approveBrand(brandId);

            toast.success("Marque approuvée avec succès !", {
                icon: "✅",
                duration: 4000
            });

            // Invalider les caches
            queryClient.invalidateQueries({ queryKey: ['brands-moderation'] });
            queryClient.invalidateQueries({ queryKey: ['brand-moderation', brandId] });

            return true;
        } catch (error: any) {
            toast.error(
                error?.message || "Impossible d'approuver la marque",
                { icon: "❌" }
            );
            return false;
        } finally {
            setApproving(false);
        }
    };

    const rejectBrand = async (brandId: number, reason: string): Promise<boolean> => {
        try {
            setRejecting(true);
            await brandsService.rejectBrand(brandId, reason);

            toast.success("Marque rejetée", {
                icon: "⚠️",
                duration: 4000
            });

            // Invalider les caches
            queryClient.invalidateQueries({ queryKey: ['brands-moderation'] });
            queryClient.invalidateQueries({ queryKey: ['brand-moderation', brandId] });

            return true;
        } catch (error: any) {
            toast.error(
                error?.message || "Impossible de rejeter la marque",
                { icon: "❌" }
            );
            return false;
        } finally {
            setRejecting(false);
        }
    };

    return {
        approving,
        rejecting,
        approveBrand,
        rejectBrand
    };
}
