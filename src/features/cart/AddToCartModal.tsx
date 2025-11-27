import {ProductDetail, SizeVariant} from "@/types/Product";

interface CartModalProps {
    open: boolean;
    product: ProductDetail;
    brandName: string;
    selectedSize?: SizeVariant;
    quantity: number;
    onQuantityChange: (qty: number) => void;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function AddToCartModal({
                              open,
                              product,
                              brandName,
                              selectedSize,
                              quantity,
                              onQuantityChange,
                              onClose,
                              onConfirm
                          }: CartModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Ajouter au panier</h2>

                <div className="flex gap-4 mb-4">
                    <img
                        src={"../../../images/" + product.media[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{brandName}</p>
                        <p className="mt-1 font-semibold">
                            {product.salePrice ?? product.price} €
                        </p>
                        {product.primaryColor && (
                            <p className="text-xs text-gray-500">
                                Couleur : {product.primaryColor.name}
                            </p>
                        )}
                        {selectedSize && (
                            <p className="text-xs text-gray-500">
                                Taille : {selectedSize.size?.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-gray-600">Quantité</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="min-w-[2rem] text-center font-medium">
                            {quantity}
                        </span>
                        <button
                            onClick={() => onQuantityChange(quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}
