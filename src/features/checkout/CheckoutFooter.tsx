import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CartDto } from "@/api/services/cart/types";
import { PaymentModal } from "./PaymentModal";
import { ShippingChoice } from "@/types/checkout";
import { Loader2 } from "lucide-react";

type Props = {
    cart: CartDto;
    selectedAddressId: number | null;
    shippingChoices: Map<number, ShippingChoice>;
    orderId: number | null;
    processing: boolean;
    onCreateOrder: () => Promise<number | null>;
    onPaymentSuccess: () => void;
};

export function CheckoutFooter({
                                   cart,
                                   selectedAddressId,
                                   shippingChoices,
                                   orderId,
                                   processing,
                                   onCreateOrder,
                                   onPaymentSuccess,
                               }: Props) {
    const { t } = useTranslation();
    // État pour gérer l'ouverture du modal de paiement
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    // Ouvrir automatiquement le modal quand la commande est créée
    useEffect(() => {
        if (orderId) {
            setPaymentModalOpen(true);
        }
    }, [orderId]);

    // Compter les marques présentes dans le panier
    const itemsByBrand = useMemo(() => {
        const grouped = new Map<number, number>();
        cart.items.forEach((item) => {
            grouped.set(item.brandId, (grouped.get(item.brandId) || 0) + 1);
        });
        return grouped;
    }, [cart.items]);

    // Vérifier que toutes les marques ont une méthode de livraison
    const allBrandsHaveMethod = useMemo(() => {
        return Array.from(itemsByBrand.keys()).every((brandId) =>
            shippingChoices.has(brandId)
        );
    }, [itemsByBrand, shippingChoices]);

    const canProceed = selectedAddressId !== null && allBrandsHaveMethod;

    return (
        <div className="mt-6">
            {!orderId ? (
                <>
                    <button
                        onClick={onCreateOrder}
                        disabled={!canProceed || processing}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                            canProceed && !processing
                                ? "bg-black hover:bg-gray-800 active:scale-[0.98]"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={20} />
                                {t('checkout.creating_order')}
                            </span>
                        ) : (
                            t('checkout.create_order')
                        )}
                    </button>

                    {!canProceed && (
                        <p className="text-sm text-red-600 mt-2 text-center">
                            {!selectedAddressId
                                ? t('checkout.error_no_address')
                                : t('checkout.error_no_delivery_mode')}
                        </p>
                    )}
                </>
            ) : (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                        {t('checkout.order_created')}
                    </div>

                    <button
                        onClick={() => setPaymentModalOpen(true)}
                        className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-[0.98]"
                    >
                        {t('checkout.proceed_to_payment')}
                    </button>
                </div>
            )}

            {/* Modal de paiement */}
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                orderId={orderId}
                onPaymentSuccess={onPaymentSuccess}
            />
        </div>
    );
}