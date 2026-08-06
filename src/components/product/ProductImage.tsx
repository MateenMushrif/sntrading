"use client";

import { CldImage } from "next-cloudinary";

interface ProductImageProps {
    publicId: string;
    alt: string;
}

export function ProductImage({ publicId, alt }: ProductImageProps) {
    return (
        <CldImage
            width="600"
            height="600"
            src={publicId}
            alt={alt}
            crop="fill"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
        />
    );
}