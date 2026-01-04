import {Routes, Route, Navigate} from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPageWrapper } from "@/pages/brands/BrandPageWrapper";
import { ProductPage } from "@/pages/products/Product";
import { Wishlist } from "@/pages/wishlist/Wishlist";
import { SetPassword } from "@/pages/register/SetPassword";
import { AccountsManagement } from "@/pages/admin/AccountsManagement";
import { AdminEthicsManagement } from "@/pages/admin/AdminEthicsManagement";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import {MyBrandPage} from "@/pages/brands/MyBrandPage";
import {BrandInfoPageWrapper} from "@/pages/brands/BrandInfoPageWrapper";
import {SettingsPage} from "@/pages/settings/Settings";
import {CheckoutPage} from "@/pages/checkout/CheckoutPage";
import {OrderConfirmation} from "@/pages/checkout/OrderConfirmation";
import {OrdersPage} from "@/pages/order/OrdersPage";
import {OrderDetailsPage} from "@/pages/order/OrderDetailsPage";
import {PaymentMethodsManagement} from "@/pages/admin/PaymentMethodsManagement";
import {ModeratorProductReviewsPage} from "@/pages/moderator/ModeratorProductReviewsPage";
import {BecomeBrandPage} from "@/pages/brands/BecomeBrandPage";

export default function AppRouter() {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/devenir-marque" element={<BecomeBrandPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brandName" element={<BrandPageWrapper />} />
            <Route path="/brand/:brandName/product/:productId" element={<ProductPage />} />
            <Route path="/brand/:brandName/info" element={<BrandInfoPageWrapper />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:orderId/confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />

            {/* Routes protégées - Client */}
            <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings/:tab"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />

            {/* Routes protégées - Admin/Moderator */}
            <Route
                path="/admin/accounts"
                element={
                    <ProtectedRoute requiredRoles={["Administrator", "Moderator"]}>
                        <AccountsManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/ethics"
                element={
                    <ProtectedRoute requiredRoles={["Administrator"]}>
                        <AdminEthicsManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/payments"
                element={
                    <ProtectedRoute requiredRoles={["Administrator"]}>
                        <PaymentMethodsManagement />
                    </ProtectedRoute>
                }
            />
            {/* Moderator Routes */}
            <Route
                path="/moderator/reviews"
                element={
                    <ProtectedRoute requiredRoles={["Moderator"]}>
                        <ModeratorProductReviewsPage />
                    </ProtectedRoute>
                }
            />
            {/* SuperVendor Routes */}
            <Route
                path="/my-brand"
                element={
                    <ProtectedRoute requiredRoles={["SuperVendor"]}>
                        <MyBrandPage />
                    </ProtectedRoute>
                }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
