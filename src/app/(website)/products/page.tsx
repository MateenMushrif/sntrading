import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        brand?: string;
        page?: string;
    }>;
}

// 1. Dynamic Metadata Generator
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
    const { search, category, brand } = await searchParams;

    let title = "All Bakery Products | Wholesale Ingredients Catalog";
    if (search) title = `Search results for "${search}" | SN Trading`;
    else if (category) title = `${category} Products | SN Trading`;
    else if (brand) title = `${brand} Products | SN Trading`;

    return {
        title,
        description:
            "Browse SN Trading wholesale bakery materials including cocoa powders, chocolate compounds, margarine, premixes, and flavors.",
    };
}

// 2. Cached Server-Side Query
const getProducts = cache(async (params: Awaited<ProductsPageProps["searchParams"]>) => {
    const { search, category, brand } = params;

    const where: Prisma.ProductWhereInput = {
        status: "ACTIVE",
    };

    // Filter by expanded search (matches name, description, category, brand, SKU)
    if (search?.trim()) {
        const query = search.trim();
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
            { brand: { name: { contains: query, mode: "insensitive" } } },
            { variants: { some: { sku: { contains: query, mode: "insensitive" } } } },
            { variants: { some: { name: { contains: query, mode: "insensitive" } } } },
        ];
    }

    // Filter by Category Slug
    if (category?.trim()) {
        where.category = { slug: category.trim() };
    }

    // Filter by Brand Slug
    if (brand?.trim()) {
        where.brand = { slug: brand.trim() };
    }

    return prisma.product.findMany({
        where,
        select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            status: true,
            category: {
                select: { id: true, name: true, slug: true },
            },
            brand: {
                select: { id: true, name: true, slug: true },
            },
            thumbnailImage: {
                select: { id: true, secureUrl: true, altText: true },
            },
            specifications: {
                select: { id: true, label: true, value: true },
                orderBy: { displayOrder: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
});

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const products = await getProducts(resolvedParams);

    const activeFilterText =
        resolvedParams.search
            ? `Results for "${resolvedParams.search}"`
            : resolvedParams.category
                ? `Category: ${resolvedParams.category}`
                : resolvedParams.brand
                    ? `Brand: ${resolvedParams.brand}`
                    : "All Products";

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 space-y-6">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {activeFilterText}
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {products.length} commercial bakery ingredients found
                    </p>
                </div>
            </div>

            {/* Instant Server-Rendered Product Grid */}
            <ProductGrid products={products} />
        </main>
    );
}