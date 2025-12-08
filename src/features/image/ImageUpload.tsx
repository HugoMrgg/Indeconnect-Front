import React, { useRef, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    folder?: string;
    onUploadComplete: (url: string) => void;
    currentImageUrl?: string;
    maxSizeMB?: number;
}

export function ImageUpload({
                                folder = "products",
                                onUploadComplete,
                                currentImageUrl,
                                maxSizeMB = 5
                            }: ImageUploadProps) {
    const { uploadImage, uploading, error } = useImageUpload();
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local immédiat
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload vers Cloudinary
        const url = await uploadImage(file, {
            folder,
            maxSizeMB
        });

        if (url) {
            onUploadComplete(url);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {/* Zone d'upload */}
                <div
                    className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            {uploading ? (
                                <div className="animate-spin">
                                    <Upload size={32} />
                                </div>
                            ) : (
                                <>
                                    <ImageIcon size={32} />
                                    <p className="mt-2 text-sm">Cliquer pour upload</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Info */}
                <div className="flex-1">
                    <p className="text-sm text-gray-600">
                        Formats acceptés : JPEG, PNG, WebP
                    </p>
                    <p className="text-sm text-gray-600">
                        Taille max : {maxSizeMB} MB
                    </p>
                </div>
            </div>

            {/* Erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Loading */}
            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full animate-pulse"
                        style={{ width: "50%" }}
                    />
                </div>
            )}
        </div>
    );
}
