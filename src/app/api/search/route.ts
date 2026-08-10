import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [], categories: [] });
    }

    try {
        // Run concurrent search for products and categories
        const [products, categories] = await Promise.all([
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { shortDescription: { contains: query, mode: "insensitive" } },
                        { category: { name: { contains: query, mode: "insensitive" } } },
                        { brand: { name: { contains: query, mode: "insensitive" } } },
                        { variants: { some: { sku: { contains: query, mode: "insensitive" } } } },
                        { variants: { some: { name: { contains: query, mode: "insensitive" } } } },
                    ],
                },
                take: 6,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    brand: {
                        select: { id: true, name: true, slug: true },
                    },
                    thumbnailImage: {
                        select: { id: true, secureUrl: true, altText: true },
                    },
                    images: {
                        take: 1,
                        select: { id: true, secureUrl: true, altText: true },
                    },
                    variants: {
                        take: 1,
                        orderBy: { displayOrder: "asc" },
                        select: { id: true, name: true, weightOrSize: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.category.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: 4,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            }),
        ]);

        return NextResponse.json(
            { products, categories },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                },
            }
        );
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Failed to execute search query" },
            { status: 500 }
        );
    }
}