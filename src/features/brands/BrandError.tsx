import { BannerBrand } from "@/features/banners/BannerBrand";
import { NavBar } from "@/features/navbar/NavBar";

export const BrandError = ({
                               name,
                               message,
                               bannerUrl
                           }: {
    name: string;
    message: string;
    bannerUrl?: string;
}) => (
    <div className="min-h-full bg-white">
        <BannerBrand name={name} bannerUrl={bannerUrl} />
        <main className="mx-auto max-w-6xl px-4 pb-16">
            <p className="text-red-600">{message}</p>
        </main>
        <NavBar />
    </div>
);
