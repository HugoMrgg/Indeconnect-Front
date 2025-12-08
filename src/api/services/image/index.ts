import axiosInstance from "@/api/api";
import { IMAGES_ROUTES } from "@/api/services/image/routes";
import {
    SignatureRequest,
    UploadSignature,
    CloudinaryUploadResponse,
    UploadOptions
} from "@/api/services/image/types";

export const imagesService = {
    // Obtenir une signature d'upload du backend
    getUploadSignature: async (
        folder: string = "products"
    ): Promise<UploadSignature> => {
        const response = await axiosInstance.post<UploadSignature>(
            IMAGES_ROUTES.signature,
            { folder } as SignatureRequest
        );
        return response.data;
    },

    // Uploader directement vers Cloudinary
    uploadToCloudinary: async (
        file: File,
        signature: UploadSignature
    ): Promise<CloudinaryUploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature.signature);
        formData.append("timestamp", signature.timestamp.toString());
        formData.append("api_key", signature.apiKey);
        formData.append("folder", signature.folder);

        const url = IMAGES_ROUTES.cloudinaryUpload(signature.cloudName);

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Failed to upload image");
        }

        return await response.json();
    },

    // Helper complet : signature + upload
    uploadImage: async (
        file: File,
        options: UploadOptions = {}
    ): Promise<string> => {
        const {
            folder = "products",
            maxSizeMB = 5,
            allowedFormats = ["image/jpeg", "image/png", "image/webp"]
        } = options;

        // Validation du type
        if (!allowedFormats.includes(file.type)) {
            throw new Error(
                `Format non supporté. Formats acceptés: ${allowedFormats.join(", ")}`
            );
        }

        // Validation de la taille
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new Error(`L'image ne peut pas dépasser ${maxSizeMB} MB`);
        }

        // 1. Obtenir la signature
        const signature = await imagesService.getUploadSignature(folder);

        // 2. Upload vers Cloudinary
        const result = await imagesService.uploadToCloudinary(file, signature);

        // 3. Retourner l'URL sécurisée
        return result.secure_url;
    },

    // Supprimer une image (Admin seulement)
    deleteImage: async (publicId: string): Promise<void> => {
        await axiosInstance.delete(IMAGES_ROUTES.delete(publicId));
    }
};
