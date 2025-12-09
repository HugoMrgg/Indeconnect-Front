import { useState } from "react";
import { ImageUploader } from "@/features/brands/ImageUploader";
import { Edit2 } from "lucide-react";

interface BannerBrandProps {
    name: string;
    bannerUrl?: string | null;
    editMode?: boolean;
    onUpdate?: (url: string | null) => void;
}

export const BannerBrand = ({ name, bannerUrl, editMode = false, onUpdate }: BannerBrandProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Image par défaut si pas de banner
    const fallbackBanner = "/banners/default-brand-banner.png";
    const img = bannerUrl || fallbackBanner;

    return (
        <>
            <section
                className={`
                    relative w-screen h-[20vh] min-h-[100px] md:h-[25vh] 
                    overflow-hidden bg-center bg-cover
                    ${editMode ? "group" : ""}
                `}
                style={{
                    backgroundImage: `url('${img}')`,
                }}
            >
                <div className="absolute inset-0 bg-black/40" />

                <h2 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-2xl md:text-4xl drop-shadow-lg">
                    {name}
                </h2>

                {/* Bouton Modifier (visible au survol en mode édition) */}
                {editMode && onUpdate && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="
                            absolute top-4 right-4 z-10
                            flex items-center gap-2 px-4 py-2
                            bg-white/90 hover:bg-white
                            text-gray-900 font-medium
                            rounded-lg shadow-lg
                            opacity-0 group-hover:opacity-100
                            transition-all duration-200
                        "
                    >
                        <Edit2 size={18} />
                        Modifier la bannière
                    </button>
                )}
            </section>

            {/* Modal d'édition */}
            {isEditing && onUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-semibold mb-4">Modifier la bannière</h3>

                        <ImageUploader
                            label="Bannière"
                            currentUrl={bannerUrl}
                            onUpload={(url) => {
                                onUpdate(url);
                                setIsEditing(false);
                            }}
                            aspectRatio="banner"
                            folder="brands/banners"
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
