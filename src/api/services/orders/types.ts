export type CreateOrderDto = {
    shippingAddressId: number;
    deliveryChoices: DeliveryChoiceDto[];
};

export type DeliveryChoiceDto = {
    brandId: number;
    shippingMethodId: number;
};

export type OrderStatus =
    | "Pending"
    | "Paid"
    | "Processing"
    | "Delivered"
    | "Cancelled";

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

export type OrderItemDto = {
    id: number;
    productId: number;
    productName: string;
    variantId: number | null;
    quantity: number;
    unitPrice: number;
};

export type InvoiceDto = {
    id: number;
    brandId: number;
    invoiceNumber: string;
    amount: number;
    issuedAt: string;
};

export type DeliveryStatus =
    | "Pending"
    | "Preparing"
    | "Shipped"
    | "InTransit"
    | "OutForDelivery"
    | "Delivered"
    | "Failed"
    | "Returned"
    | "Cancelled";

export type OrderTrackingDto = {
    orderId: number;
    globalStatus: OrderStatus;
    placedAt: string;
    totalAmount: number;
    deliveriesByBrand: BrandDeliveryTrackingDto[];
    latestEstimatedDelivery: string | null;
};

export type BrandDeliveryTrackingDto = {
    brandDeliveryId: number;
    brandId: number;
    brandName: string;
    brandLogoUrl: string | null;
    status: DeliveryStatus;
    trackingNumber: string | null;
    items: OrderItemDto[];
    totalAmount: number;
    createdAt: string;
    shippedAt: string | null;
    deliveredAt: string | null;
    estimatedDelivery: string | null;
    timeline: TrackingStepDto[];
};

export type TrackingStepDto = {
    status: string;
    label: string;
    description: string;
    completedAt: string | null;
    isCompleted: boolean;
    isCurrent: boolean;
};