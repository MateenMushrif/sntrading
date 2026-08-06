import { fetcher } from "./api.service";

export interface GetProductsParams {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
}

export const productService = {
    // Fetch paginated products with filters
    getProducts: (params: GetProductsParams = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.set("page", params.page.toString());
        if (params.limit) query.set("limit", params.limit.toString());
        if (params.category) query.set("category", params.category);
        if (params.brand) query.set("brand", params.brand);
        if (params.search) query.set("search", params.search);

        return fetcher<{ data: any[]; pagination: any }>(`/api/products?${query.toString()}`);
    },

    // Fetch single product detail
    getProductBySlug: (slug: string) => {
        return fetcher<any>(`/api/products/${slug}`);
    },

    // Live auto-complete search
    search: (query: string) => {
        return fetcher<{ products: any[]; categories: any[] }>(`/api/search?q=${encodeURIComponent(query)}`);
    },

    // Submit Inquiry Cart Order
    submitInquiry: (data: {
        buyerName: string;
        businessName?: string;
        phone: string;
        email?: string;
        notes?: string;
        items: any[];
    }) => {
        return fetcher<{ success: boolean; whatsappUrl: string }>("/api/inquiry", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};