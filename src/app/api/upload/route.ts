import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { validateDeviceToken } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PROTECTED: Staff/Admin image upload endpoint
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get("folder") || "sntrading";

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: `sntrading/${folder}` },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        // Return secureUrl (expected by frontend api.ts) along with publicId and url fallback
        return NextResponse.json({
            secureUrl: uploadResult.secure_url,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        });
    } catch (error) {
        console.error("Upload API error:", error);
        const message = error instanceof Error ? error.message : "Failed to upload image";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}