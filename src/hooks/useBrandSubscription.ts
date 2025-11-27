import { useState, useEffect } from "react";
import { BrandSubscriptionService } from "@/api/services/subscriptions";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export function useBrandSubscription(brandId: number | undefined) {
    const { user } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    // Charger l'état initial
    useEffect(() => {
        if (!user?.id || !brandId) {
            setIsSubscribed(false);
            setLoading(false);
            return;
        }

        async function checkSubscription() {
            try {
                const subscribed = await BrandSubscriptionService.isSubscribed(brandId!);
                setIsSubscribed(subscribed);
            } catch (error) {
                console.error("Error checking subscription:", error);
                setIsSubscribed(false);
            } finally {
                setLoading(false);
            }
        }

        checkSubscription();
    }, [user?.id, brandId]);

    // Fonction pour toggle l'abonnement
    const toggleSubscription = async () => {
        if (!user?.id) {
            toast.error("Connecte-toi pour t'abonner aux marques ❤️");
            return;
        }

        if (!brandId) {
            toast.error("Marque non trouvée");
            return;
        }

        const currentState = isSubscribed;

        // Optimistic update
        setIsSubscribed(!currentState);

        try {
            if (!currentState) {
                await BrandSubscriptionService.subscribe(brandId);
                toast.success("Abonné à la marque ✓", {
                    icon: "❤️",
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
            } else {
                await BrandSubscriptionService.unsubscribe(brandId);
                toast.success("Désabonné de la marque", {
                    icon: "💔",
                    style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "10px",
                    },
                });
            }
        } catch (error) {
            console.error("Subscription error:", error);
            // Rollback en cas d'erreur
            setIsSubscribed(currentState);
            toast.error("Une erreur est survenue");
        }
    };

    return {
        isSubscribed,
        loading,
        toggleSubscription,
    };
}
