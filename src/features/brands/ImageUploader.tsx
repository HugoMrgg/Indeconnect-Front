import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { imagesService } from "@/api/services/image";
import toast from "react-hot-toast";

interface ImageUploaderProps {
    label: string;
    currentUrl?: string | null;
    onUpload: (url: string | null) => void;
    aspectRatio?: "square" | "banner";
}

export function ImageUploader({
                                  label,
                                  currentUrl,
                                  onUpload,
                                  aspectRatio = "square",
                              }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            // Preview locale
            const previewUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setPreview(previewUrl);

            const cloudinaryUrl = await imagesService.uploadImage(file, {
                maxSizeMB: 10,
                allowedFormats: ["image/jpeg", "image/png", "image/webp"]
            });

            setPreview(cloudinaryUrl);
            onUpload(cloudinaryUrl);

        } catch (err) {
            console.error("Erreur upload:", err);
            toast.error("Erreur lors de l'upload de l'image. Vérifiez la console.");
            setPreview(currentUrl ?? null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const aspectClass = aspectRatio === "banner" ? "aspect-[3/1]" : "aspect-square";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className={`relative ${aspectClass} w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors`}>
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={uploading}
                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                            aria-label="Supprimer l'image"
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                        {uploading ? (
                            <Loader2 size={32} className="animate-spin" />
                        ) : (
                            <Upload size={32} />
                        )}
                        <span className="text-sm font-medium">
                            {uploading ? "Upload en cours..." : "Cliquer pour uploader"}
                        </span>
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />
        </div>
    );
}