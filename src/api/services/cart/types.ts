export type AddToCartRequest = {
    quantity: number;
};

export type CartItemDto = {
    productId: number;
    productName: string;
    brandName: string;
    primaryImage: string;
    color?: { id: number; name: string; hexa: string } | null;
    size?: { id: number; name: string } | null;
    productVariantId: number;
    sku: string;
    stockCount: number;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    addedAt: string;
};

export type CartDto = {
    id: number;
    userId: number;
    items: CartItemDto[];
    totalItems: number;
    totalAmount: number;
};
