import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { BrandPageWrapper } from "@/pages/brands/BrandPageWrapper"; // ou BrandPage directement
import { LoginPage } from "@/pages/users/Login";
import { RegisterPage } from "@/pages/users/Register";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brand/:brandName" element={<BrandPageWrapper />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
}

