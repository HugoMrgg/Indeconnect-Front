import { useMemo } from "react";
import { CartDto, CartItemDto } from "@/api/services/cart/types";
import { ShippingChoice } from "@/types/checkout";

type Props = {
    cart: CartDto;
    itemsByBrand: Map<number, CartItemDto[]>;
    shippingChoices: Map<number, ShippingChoice>;
};

export function CheckoutSummary({ cart, itemsByBrand, shippingChoices }: Props) {
    const shippingCost = useMemo(() => {
        let total = 0;
        shippingChoices.forEach((choice) => {
            total += choice.price;
        });
        return total;
    }, [shippingChoices]);

    const VAT_RATE = 0.21;
    const totalProducts = cart.totalAmount;
    const totalWithShipping = totalProducts + shippingCost;

    const totalHT = totalWithShipping / (1 + VAT_RATE);
    const totalVAT = totalWithShipping - totalHT;

    return (
        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>

            <div className="space-y-3 mb-4 pb-4 border-b">
                {Array.from(itemsByBrand.entries()).map(([brandId, items]) => {
                    const brandTotal = items.reduce(
                        (sum, item) => sum + item.unitPrice * item.quantity,
                        0
                    );
                    const choice = shippingChoices.get(brandId);

                    return (
                        <div key={brandId} className="text-sm">
                            <div className="flex justify-between font-medium">
                                <span>{items[0].brandName}</span>
                                <span>{brandTotal.toFixed(2)} €</span>
                            </div>
                            {choice && (
                                <div className="text-xs text-gray-600 mt-1 flex justify-between">
                                    <span>✓ {choice.displayName}</span>
                                    <span>
                                        {choice.price === 0
                                            ? "Gratuit"
                                            : `+${choice.price.toFixed(2)} €`}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span>Sous-total produits</span>
                    <span>{totalProducts.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className={shippingCost === 0 ? "text-green-600" : "text-gray-900"}>
                        {shippingCost === 0 ? "Gratuit" : `${shippingCost.toFixed(2)} €`}
                    </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>dont TVA (21%)</span>
                    <span>{totalVAT.toFixed(2)} €</span>
                </div>
            </div>

            <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total TTC</span>
                    <span>{totalWithShipping.toFixed(2)} €</span>
                </div>
            </div>
        </div>
    );
}