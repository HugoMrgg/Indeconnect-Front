export type CreateOrderDto = {
    shippingAddressId: number;
    deliveryChoices: DeliveryChoiceDto[];
};

export type DeliveryChoiceDto = {
    brandId: number;
    shippingMethodId: number;
};

// ORDRE COMPLET (matche OrderDto du backend)
export type OrderDto = {
    id: number;
    userId: number;
    shippingAddressId: number;
    totalAmount: number;
    status: OrderStatus;
    placedAt: string;
    currency: string;
    items: OrderItemDto[];
    invoices: InvoiceDto[];
};

// ITEM D'UNE COMMANDE
export type OrderItemDto = {
    id: number;
    productId: number;
    productName: string;
    variantId: number | null;
    quantity: number;
    unitPrice: number;
};

// FACTURE PAR MARQUE
export type InvoiceDto = {
    id: number;
    brandId: number;
    invoiceNumber: string;
    amount: number;
    issuedAt: string;
};

// STATUTS (matche OrderStatus enum du backend)
export type OrderStatus =
    | "Pending"
    | "Paid"
    | "Delivered"
    | "Cancelled";