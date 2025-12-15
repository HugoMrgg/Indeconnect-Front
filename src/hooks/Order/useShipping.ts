import { useState, useCallback } from "react";
import {
    getUserAddresses,
    createShippingAddress,
    getBrandShippingMethods,
    getMultipleBrandsShippingMethods,
    createBrandShippingMethod,
    updateBrandShippingMethod,
    deleteBrandShippingMethod,
} from "@/api/services/shipping";
import {
    ShippingAddressDto,
    CreateShippingAddressDto,
    ShippingMethodDto,
    CreateShippingMethodDto,
    UpdateShippingMethodDto,
} from "@/api/services/shipping/types";
import { extractErrorMessage } from "@/utils/errorHandling";
import toast from "react-hot-toast";

export function useShipping() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<ShippingAddressDto[]>([]);
    const [methods, setMethods] = useState<ShippingMethodDto[]>([]);

    // Récupérer les adresses d'un utilisateur
    const fetchAddresses = useCallback(async (userId: number): Promise<ShippingAddressDto[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const userAddresses = await getUserAddresses(userId);
            setAddresses(userAddresses);
            return userAddresses;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            toast.error(message);
            console.error("[useShipping] fetchAddresses error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Créer une adresse
    const createAddress = useCallback(
        async (userId: number, data: CreateShippingAddressDto): Promise<ShippingAddressDto | null> => {
            setLoading(true);
            setError(null);

            try {
                const newAddress = await createShippingAddress(userId, data);
                setAddresses((prev) => [...prev, newAddress]);
                toast.success("Adresse ajoutée !");
                return newAddress;
            } catch (err: unknown) {
                const message = extractErrorMessage(err);
                setError(message);
                toast.error(message);
                console.error("[useShipping] createAddress error:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Récupérer les méthodes de livraison d'une marque
    const fetchBrandMethods = useCallback(async (brandId: number): Promise<ShippingMethodDto[] | null> => {
        setLoading(true);
        setError(null);

        try {
            const brandMethods = await getBrandShippingMethods(brandId);
            setMethods(brandMethods);
            return brandMethods;
        } catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            console.error("[useShipping] fetchBrandMethods error:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Récupérer les méthodes pour plusieurs marques (optimisé)
    const fetchMultipleBrandsMethods = useCallback(
        async (brandIds: number[]): Promise<Record<number, ShippingMethodDto[]> | null> => {
            setLoading(true);
            setError(null);

            try {
                const methodsByBrand = await getMultipleBrandsShippingMethods(brandIds);
                return methodsByBrand;
            } catch (err: unknown) {
                const message = extractErrorMessage(err);
                setError(message);
                console.error("[useShipping] fetchMultipleBrandsMethods error:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Créer une méthode de livraison
    const createMethod = useCallback(
        async (brandId: number, data: CreateShippingMethodDto): Promise<ShippingMethodDto | null> => {
            setLoading(true);
            setError(null);

            try {
                const newMethod = await createBrandShippingMethod(brandId, data);
                toast.success("Méthode de livraison ajoutée");
                return newMethod;
            } catch (err: unknown) {
                const message = extractErrorMessage(err);
                setError(message);
                toast.error(message);
                console.error("[useShipping] createMethod error:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Modifier une méthode de livraison
    const updateMethod = useCallback(
        async (brandId: number, methodId: number, data: UpdateShippingMethodDto): Promise<ShippingMethodDto | null> => {
            setLoading(true);
            setError(null);

            try {
                const updated = await updateBrandShippingMethod(brandId, methodId, data);
                toast.success("Méthode mise à jour");
                return updated;
            } catch (err: unknown) {
                const message = extractErrorMessage(err);
                setError(message);
                toast.error(message);
                console.error("[useShipping] updateMethod error:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Supprimer une méthode de livraison
    const deleteMethod = useCallback(
        async (brandId: number, methodId: number): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                await deleteBrandShippingMethod(brandId, methodId);
                toast.success("Méthode supprimée");
                return true;
            } catch (err: unknown) {
                const message = extractErrorMessage(err);
                setError(message);
                toast.error(message);
                console.error("[useShipping] deleteMethod error:", err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        error,
        addresses,
        methods,
        fetchAddresses,
        createAddress,
        fetchBrandMethods,
        fetchMultipleBrandsMethods,
        createMethod,
        updateMethod,
        deleteMethod,
    };
}