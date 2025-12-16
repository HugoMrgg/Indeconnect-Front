export type ShippingAddressDto = {
    id: number;
    userId: number;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
    extra?: string;
    isDefault: boolean;
};

export type CreateShippingAddressDto = Omit<ShippingAddressDto, "id" | "userId">;

export type ShippingMethodDto = {
    id: number;
    providerName: string; // "BPost", "Colruyt", "DHL"
    methodType: "HomeDelivery" | "Locker" | "PickupPoint" | "StorePickup";
    displayName: string;
    price: number;
    estimatedMinDays: number;
    estimatedMaxDays: number;
    maxWeight?: number;
    isEnabled: boolean;

    totalEstimatedMinDays?: number;
    totalEstimatedMaxDays?: number;
    estimatedDeliveryDate?: string;
};

export type CreateShippingMethodDto = {
    providerName: string;
    methodType: "HomeDelivery" | "Locker" | "PickupPoint" | "StorePickup";
    displayName: string;
    price: number;
    estimatedMinDays: number;
    estimatedMaxDays: number;
    maxWeight?: number;
    providerConfig?: string; // JSON pour config spécifique au provider
};

export type UpdateShippingMethodDto = Partial<CreateShippingMethodDto> & {
    isEnabled?: boolean;
};
