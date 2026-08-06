import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface FuzzyResult {
    id: string;
    name: string;
    slug: string;
    score: number;
}

// PUBLIC: Global autocomplete search endpoint for products & categories
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [], categories: [] });
    }

    try {
        // 1. Exact / Partial ILIKE Match for Products
        const exactProducts = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { variants: { some: { sku: { contains: query, mode: "insensitive" } } } },
                    { variants: { some: { name: { contains: query, mode: "insensitive" } } } },
                ],
            },
            take: 6,
            include: {
                category: true,
                brand: true,
                thumbnailImage: true,
                images: true,
                variants: {
                    take: 1,
                    orderBy: { displayOrder: "asc" },
                },
            },
        });

        const products = [...exactProducts];

        // 2. Fallback to pg_trgm Similarity Search for typo tolerance if results < 4
        if (exactProducts.length < 4) {
            const fuzzyProductsRaw = await prisma.$queryRaw<FuzzyResult[]>`
                SELECT p.id, p.name, p.slug, 
                       SIMILARITY(p.name, ${query}) as score
                FROM "Product" p
                WHERE SIMILARITY(p.name, ${query}) > 0.15
                ORDER BY score DESC
                LIMIT 6;
            `;

            const fuzzyIds = fuzzyProductsRaw.map((p) => p.id);

            if (fuzzyIds.length > 0) {
                const fuzzyProducts = await prisma.product.findMany({
                    where: {
                        id: { in: fuzzyIds },
                    },
                    include: {
                        category: true,
                        brand: true,
                        thumbnailImage: true,
                        images: true,
                        variants: {
                            take: 1,
                            orderBy: { displayOrder: "asc" },
                        },
                    },
                });

                // Map fuzzy products by ID to preserve trigram relevance order
                const fuzzyMap = new Map(fuzzyProducts.map((p) => [p.id, p]));
                const existingIds = new Set(products.map((p) => p.id));

                for (const id of fuzzyIds) {
                    if (!existingIds.has(id)) {
                        const matchedProduct = fuzzyMap.get(id);
                        if (matchedProduct) {
                            products.push(matchedProduct);
                        }
                    }
                }
            }
        }

        // 3. Search Categories
        const categories = await prisma.category.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
            },
            take: 3,
        });

        return NextResponse.json({
            products: products.slice(0, 6),
            categories,
        });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Failed to execute search" },
            { status: 500 }
        );
    }
}