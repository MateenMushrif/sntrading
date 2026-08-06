import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadCatalogueImage(
    fileUri: string,
    folder = "sn-trading/products"
) {
    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            folder,
            resource_type: "image",
            transformation: [
                { quality: "auto", fetch_format: "auto" }, // Automatic optimization
            ],
        });

        return {
            publicId: result.public_id,
            url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
}

export async function deleteCatalogueImage(publicId: string) {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        throw new Error("Failed to delete image from Cloudinary");
    }
}

export { cloudinary };