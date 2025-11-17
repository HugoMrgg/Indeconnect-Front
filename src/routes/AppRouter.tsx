import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPageWrapper } from "@/pages/brands/BrandPageWrapper";
import { ProductPage } from "@/pages/products/Product";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brandName" element={<BrandPageWrapper />} />
            <Route path="/brand/:brandName/product/:productId" element={<ProductPage />} />
        </Routes>
    );
}

