import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface ProductsPageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        brand?: string;
        page?: string;
    }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
    const { search, category, brand } = await searchParams;

    let title = "All Bakery Products | Wholesale Ingredients Catalog";
    if (search) title = `Search results for "${search}" | SN Trading`;
    else if (category) title = `${category.replace(/-/g, " ")} Products | SN Trading`;
    else if (brand) title = `${brand.replace(/-/g, " ")} Products | SN Trading`;

    return {
        title,
        description:
            "Browse SN Trading wholesale bakery materials including cocoa powders, chocolate compounds, margarine, premixes, and flavors.",
    };
}

const getProductsData = cache(async (params: Awaited<ProductsPageProps["searchParams"]>) => {
    const { search, category, brand, page } = params;
    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const skip = (currentPage - 1) * PAGE_SIZE;

    // Strict index-compatible filter on ACTIVE status
    const where: Prisma.ProductWhereInput = {
        status: "ACTIVE",
    };

    if (search?.trim()) {
        const query = search.trim();
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
            { brand: { name: { contains: query, mode: "insensitive" } } },
        ];
    }

    if (category?.trim()) {
        where.category = { slug: category.trim() };
    }

    if (brand?.trim()) {
        where.brand = { slug: brand.trim() };
    }

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: PAGE_SIZE,
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
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
    };
});

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const { products, totalCount, currentPage, totalPages } = await getProductsData(resolvedParams);

    const activeFilterText = resolvedParams.search
        ? `Results for "${resolvedParams.search}"`
        : resolvedParams.category
            ? `Category: ${resolvedParams.category.replace(/-/g, " ")}`
            : resolvedParams.brand
                ? `Brand: ${resolvedParams.brand.replace(/-/g, " ")}`
                : "All Products";

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 space-y-6">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                        {activeFilterText}
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Showing {products.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
                        {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} commercial bakery ingredients
                    </p>
                </div>
            </div>

            {/* Fast Server-Rendered Product Grid */}
            <ProductGrid products={products} />

            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={resolvedParams}
            />
        </main>
    );
}