interface BannerBrandProps {
    name: string;
    bannerUrl?: string; // ← NOUVEAU
}

export const BannerBrand = ({ name, bannerUrl }: BannerBrandProps) => {
    // Image par défaut si pas de banner
    const fallbackBanner = "/banners/default-brand-banner.png";
    const img = bannerUrl?bannerUrl : fallbackBanner;
    return (
        <section
            className="relative w-screen h-[20vh] min-h-[100px] md:h-[25vh] overflow-hidden bg-center bg-cover"
            style={{
                backgroundImage: `url('${img}')`,
            }}
        >
            <div className="absolute inset-0 bg-black/40" />

            <h2 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-2xl md:text-4xl drop-shadow-lg">
                {name}
            </h2>
        </section>
    );
};
