// Requête pour obtenir une signature
export interface SignatureRequest {
    folder?: string;
}

// Réponse du backend avec la signature
export interface UploadSignature {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
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
    folder?: string;
    maxSizeMB?: number;
    allowedFormats?: string[];
}
