// src/context/CartUIContext.tsx
import React, { createContext, useContext, useState } from "react";

interface CartUIContextType {
    cartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export const CartUIProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [cartOpen, setCartOpen] = useState(false);

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);

    return (
        <CartUIContext.Provider value={{ cartOpen, openCart, closeCart }}>
            {children}
        </CartUIContext.Provider>
    );
};

export const useCartUI = () => {
    const ctx = useContext(CartUIContext);
    if (!ctx) throw new Error("useCartUI must be used inside <CartUIProvider>");
    return ctx;
};
