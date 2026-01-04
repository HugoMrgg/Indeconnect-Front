import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface MediaItem {
    url: string;
    type: "Image" | "Video";
    displayOrder: number;
    isPrimary: boolean;
}

interface AddProductImageUploadProps {
    media: MediaItem[];
    uploading: boolean;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

export function AddProductImageUpload({
                                          media,
                                          uploading,
                                          onImageSelect,
                                          onRemoveImage,
                                      }: AddProductImageUploadProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <ImageIcon size={20} />
                {t('add_product.images.title')}
            </h3>

            <div className="flex flex-col gap-4">
                <label className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                {t('add_product.images.uploading')}
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                {t('add_product.images.choose')}
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageSelect}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>

                {media.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {media.map((item, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={item.url}
                                    alt={t('add_product.images.alt', { number: index + 1 })}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                {item.isPrimary && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        {t('add_product.images.primary')}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}