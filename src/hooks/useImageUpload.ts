import { useState } from "react";
import { imagesService } from "@/api/services/image";
import { UploadOptions } from "@/api/services/image/types";

export function useImageUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const uploadImage = async (
        file: File,
        options?: UploadOptions
    ): Promise<string | null> => {
        setUploading(true);
        setError(null);

        try {
            const url = await imagesService.uploadImage(file, options);
            setImageUrl(url);
            return url;
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Erreur lors de l'upload";
            setError(errorMessage);
            console.error("Upload error:", err);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const reset = () => {
        setImageUrl(null);
        setError(null);
        setUploading(false);
    };

    return {
        uploadImage,
        uploading,
        error,
        imageUrl,
        reset
    };
}
