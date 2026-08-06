export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface CloudinaryImage {
    id?: string;
    cloudinaryPublicId?: string;
    publicId?: string;
    secureUrl: string;
    width?: number | null;
    height?: number | null;
    format?: string | null;
    altText?: string | null;
    isThumbnail?: boolean;
}

export interface ProductVariant {
    id: string;
    name: string;
    weightOrSize: string;
    sku?: string | null;
    displayOrder?: number;
    imageId?: string | null;
    productId?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface ProductSpecification {
    id: string;
    label: string;
    value: string;
    displayOrder?: number;
    productId?: string;
}

export interface ProductBadgeItem {
    id: string;
    badge: {
        id: string;
        name: string;
        color?: string | null;
    };
}

export interface CategoryRelation {
    id: string;
    name: string;
    slug: string;
}

export interface BrandRelation {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    fullDescription?: string | null;
    status: ProductStatus | string;
    isFeatured?: boolean;
    displayOrder?: number;

    category?: CategoryRelation | string | null;
    brand?: BrandRelation | string | null;

    thumbnailImage?: CloudinaryImage | null;
    images?: CloudinaryImage[];

    variants?: ProductVariant[];
    specifications?: ProductSpecification[];
    badges?: ProductBadgeItem[];

    createdAt?: Date | string;
    updatedAt?: Date | string;
}