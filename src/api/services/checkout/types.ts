import {CartItemDto} from "@/api/services/cart/types";

export type ShippingMethod = "HomeDelivery" | "Locker" | "PickupPoint";

export type ShippingOptionDto = {
    method: ShippingMethod;
    label: string;
    price: number;
    ecoScore: number;
    description?: string;
};

export type ShippingAddressDto = {
    id: number;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
    extra?: string;
    isDefault: boolean;
};

export type BrandCheckoutDto = {
    brandId: number;
    brandName: string;
    brandLogoUrl?: string;
    items: CartItemDto[];
    subtotalAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    availableShippingOptions: ShippingOptionDto[];
};

export type CheckoutSummaryDto = {
    userId: number;
    totalItems: number;
    totalAmount: number;
    currency: string;
    brands: BrandCheckoutDto[];
    defaultShippingAddress?: ShippingAddressDto;
};

export type BrandShippingChoiceDto = {
    brandId: number;
    shippingMethod: ShippingMethod;
    pickupPointId?: string;
};

export type ValidateCheckoutRequest = {
    shippingAddressId: number;
    shippingChoices: BrandShippingChoiceDto[];
};

export type CheckoutValidationDto = {
    isValid: boolean;
    errors: string[];
    finalTotalAmount?: number;
    brandOrderSummaries?: BrandOrderSummaryDto[];
};

export type BrandOrderSummaryDto = {
    brandId: number;
    brandName: string;
    subtotalAmount: number;
    shippingAmount: number;
    taxAmount: number;
    totalAmount: number;
    shippingMethod: ShippingMethod;
};
