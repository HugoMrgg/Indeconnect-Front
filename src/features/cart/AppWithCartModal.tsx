// src/features/cart/AppWithCartModal.tsx
import AppRouter from "@/routes/AppRouter";
import { CartModal } from "@/features/cart/CartModal";
import { useCartUI } from "@/context/CartUIContext";
import { CartContent } from "@/features/cart/CartContent"; // Ajoute ce composant !

export function AppWithCartModal() {
    const { cartOpen, closeCart } = useCartUI();
    return (
        <>
            <AppRouter />
            <CartModal open={cartOpen} onClose={closeCart}>
                <CartContent />
            </CartModal>
        </>
    );
}
