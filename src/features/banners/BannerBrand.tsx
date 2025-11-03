export const BannerBrand = () => {
    return (
        <section
                className="relative w-screen h-[20vh] min-h-[100px] md:h-[25vh] overflow-hidden bg-center bg-cover"
                style={{
                    backgroundImage: "url('/banners/6k_skateshop_banner.png')", // <-- mets ton image ici
                }}

            >
            <div className="absolute inset-0 bg-black/40" />
        </section>
    );
};