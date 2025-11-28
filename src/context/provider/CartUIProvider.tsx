import React, { useState } from "react";
import { CartUIContext } from "../CartUIContext";

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
