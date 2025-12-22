import axiosInstance from "@/api/api";
import { PAYMENT_METHODS_ROUTES } from "./routes";
import type {PaymentMethodDto, SetupIntentResponse} from "./types";

export const paymentMethodsService = {
    getMine: async (): Promise<PaymentMethodDto[]> => {
        const res = await axiosInstance.get<PaymentMethodDto[]>(PAYMENT_METHODS_ROUTES.mine);
        return res.data;
    },

    remove: async (paymentMethodId: string): Promise<void> => {
        await axiosInstance.delete(PAYMENT_METHODS_ROUTES.byId(paymentMethodId));
    },

    setDefault: async (paymentMethodId: string): Promise<PaymentMethodDto> => {
        const res = await axiosInstance.post<PaymentMethodDto>(PAYMENT_METHODS_ROUTES.setDefault(paymentMethodId));
        return res.data;
    },

    createSetupIntent: async (): Promise<string> => {
        const res = await axiosInstance.post<SetupIntentResponse>(PAYMENT_METHODS_ROUTES.setupIntent);
        return res.data.clientSecret;
    },
};

