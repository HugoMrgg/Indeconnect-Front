import {Routes, Route, Navigate} from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPageWrapper } from "@/pages/brands/BrandPageWrapper";
import { ProductPage } from "@/pages/products/Product";
import { Wishlist } from "@/pages/wishlist/Wishlist";
import { SetPassword } from "@/pages/register/SetPassword";
import { AccountsManagement } from "@/pages/admin/AccountsManagement";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import {MyBrandPage} from "@/pages/brands/MyBrandPage";
import {BrandInfoPageWrapper} from "@/pages/brands/BrandInfoPageWrapper";
import { ProductCreatePage } from "@/pages/products/ProductCreatePage";

export default function AppRouter() {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brandName" element={<BrandPageWrapper />} />
            <Route path="/brand/:brandName/product/:productId" element={<ProductPage />} />
            <Route path="/brand/:brandName/info" element={<BrandInfoPageWrapper />} />
            <Route path="/set-password" element={<SetPassword />} />

            {/* Routes protégées - Client */}
            <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                        <Wishlist />
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


            {/* Routes protégées - SuperVendor/Vendor */}
            <Route
                path="/my-brand"
                element={
                    <ProtectedRoute requiredRoles={["SuperVendor"]}>
                        <MyBrandPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/create"
                element={
                    <ProtectedRoute requiredRoles={["SuperVendor", "Vendor"]}>
                        <ProductCreatePage />
                    </ProtectedRoute>
                }
            />


            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
