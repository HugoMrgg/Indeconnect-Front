import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPageWrapper } from "@/pages/brands/BrandPageWrapper";
import { ProductPage } from "@/pages/products/Product";
import {Wishlist} from "@/pages/wishlist/Wishlist";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brandName" element={<BrandPageWrapper />} />
            <Route path="/brand/:brandName/product/:productId" element={<ProductPage />} />
            <Route path="/wishlist" element={<Wishlist/>} />
        </Routes>
    );
}

