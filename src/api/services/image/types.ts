// Réponse du backend avec la signature
export interface UploadSignature {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    uploadPreset: string;
}

// Réponse de Cloudinary après upload
export interface CloudinaryUploadResponse {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

// Options pour l'upload
export interface UploadOptions {
    maxSizeMB?: number;
    allowedFormats?: string[];
}
