import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPage } from "@/pages/brands/Brand";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brand/:brandName" element={<BrandPage />} />
            </Routes>
        </BrowserRouter>
    );
}
