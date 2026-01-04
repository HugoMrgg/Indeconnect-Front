import { useTranslation } from "react-i18next";

export const Banner = () => {
    const { t } = useTranslation();

    return (
        <section className="relative bg-beige text-white flex justify-between items-center overflow-hidden">
            <div className="p-12 md:p-20 max-w-xl">
                <h1 className="text-5xl font-serif leading-tight">{t('home.banner.title')}</h1>
                <div className="mt-6 h-[2px] w-24 bg-white/50"></div>
            </div>
        </section>
    );
};
