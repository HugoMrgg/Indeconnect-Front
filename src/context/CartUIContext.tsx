import { createContext } from "react";

export interface CartUIContextType {
    cartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

export const CartUIContext = createContext<CartUIContextType | undefined>(undefined);
