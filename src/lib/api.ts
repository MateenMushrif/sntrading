// src/lib/api.ts

interface CustomImportMeta extends ImportMeta {
    env?: {
        VITE_API_BASE_URL?: string;
    };
}

/**
 * Dynamically resolves the API base URL for the Vite frontend:
 * 1. Reads VITE_API_BASE_URL from environment variables (if set).
 * 2. Falls back to localhost for local dev.
 */
function getApiBaseUrl(): string {
    const envUrl = (import.meta as CustomImportMeta).env?.VITE_API_BASE_URL;
    if (envUrl) {
        const cleaned = envUrl.replace(/\/$/, "");
        return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
    }

    // Fallback for local development
    return "http://localhost:3000/api";
}

const DEVICE_TOKEN = "your-device-token-here"; // fallback token if needed

export function getDeviceToken(): string | null {
    return localStorage.getItem("x-device-token") || DEVICE_TOKEN || null;
}

export function setDeviceToken(token: string): void {
    localStorage.setItem("x-device-token", token);
}

function getHeaders(): HeadersInit {
    const token = getDeviceToken() || "";
    return {
        "Content-Type": "application/json",
        "x-device-token": token,
        "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page in dev
    };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
}

export interface ProductVariant {
    id?: string;
    name?: string;
    sku?: string;
    weightOrSize?: string;
    displayOrder?: number;
}

export interface ProductImage {
    id: string;
    publicId: string;
    secureUrl: string;
    format?: string;
    width?: number;
    height?: number;
    altText?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    brandId: string;
    category: Category;
    brand: Brand;
    variants: ProductVariant[];
    thumbnailImage?: ProductImage;
    createdAt?: string;
}

export interface VerifyTokenResponse {
    valid: boolean;
    error?: string;
    device?: {
        id: string;
        deviceName: string;
        deviceId: string;
        status: string;
    };
}

export const api = {
    // --- Device Authorization Verification ---
    async verifyDeviceToken(token: string): Promise<VerifyTokenResponse> {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/trusted-devices/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({ token }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ valid: false }));
            return { valid: false, error: err.error || "Token verification failed" };
        }

        return res.json();
    },

    async getProducts(params?: { search?: string; page?: number; limit?: number }) {
        const baseUrl = getApiBaseUrl();
        const url = new URL(`${baseUrl}/products`);
        if (params?.search) url.searchParams.set("search", params.search);
        if (params?.page) url.searchParams.set("page", params.page.toString());
        if (params?.limit) url.searchParams.set("limit", params.limit.toString());

        const res = await fetch(url.toString(), { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    },

    async getCategories(): Promise<Category[]> {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/categories`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    },

    async getBrands(): Promise<Brand[]> {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/brands`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
    },

    // Upload raw image file to Next.js POST /api/upload
    async uploadImage(file: File): Promise<ProductImage> {
        const baseUrl = getApiBaseUrl();
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${baseUrl}/upload`, {
            method: "POST",
            headers: {
                "x-device-token": getDeviceToken() || "",
            },
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to upload image");
        }

        return res.json();
    },

    async createProduct(payload: {
        name: string;
        slug: string;
        categoryId: string;
        brandId: string;
        description?: string;
        thumbnailImageId?: string;
        variants?: Array<{ name?: string; weightOrSize?: string }>;
    }) {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/products`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to create product");
        }

        return res.json();
    },

    async deleteProduct(slug: string) {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/products/${slug}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to delete product");
        return res.json();
    },
};