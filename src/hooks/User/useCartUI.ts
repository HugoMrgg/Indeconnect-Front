import { useContext } from "react";
import { CartUIContext } from "@/context/CartUIContext";

export const useCartUI = () => {
    const ctx = useContext(CartUIContext);
    if (!ctx) throw new Error("useCartUI must be used inside <CartUIProvider>");
    return ctx;
};
