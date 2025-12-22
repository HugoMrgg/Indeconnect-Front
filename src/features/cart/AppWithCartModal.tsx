import AppRouter from "@/routes/AppRouter";
import { CartModal } from "@/features/cart/CartModal";
import { useCartUI } from "@/hooks/User/useCartUI";
import { CartContent } from "@/features/cart/CartContent";
import {SuperVendorEthicsGlobal} from "@/pages/brands/SuperVendorEthicsGlobal";

export function AppWithCartModal() {
    const { cartOpen, closeCart } = useCartUI();
    return (
        <>
            <SuperVendorEthicsGlobal />
            <AppRouter />
            <CartModal open={cartOpen} onClose={closeCart}>
                <CartContent />
            </CartModal>
        </>
    );
}
