export const IMAGES_ROUTES = {
    signature: "/images/signature",
    delete: (publicId: string) => `/images/${encodeURIComponent(publicId)}`,
    cloudinaryUpload: (cloudName: string) =>
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
} as const;
