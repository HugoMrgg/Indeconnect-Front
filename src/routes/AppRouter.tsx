import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPage } from "@/pages/brands/Brand";
import { LoginPage } from "@/pages/users/Login";
import { RegisterPage } from "@/pages/users/Register";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brand/:brandName" element={<BrandPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    );
}
