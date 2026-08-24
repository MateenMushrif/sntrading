import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
        return NextResponse.json({ products: [], categories: [] });
    }

    try {
        const [products, categories] = await Promise.all([
            prisma.product.findMany({
                where: {
                    status: "ACTIVE",
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { category: { name: { contains: query, mode: "insensitive" } } },
                        { brand: { name: { contains: query, mode: "insensitive" } } },
                    ],
                },
                take: 6,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    category: {
                        select: { name: true, slug: true },
                    },
                    brand: {
                        select: { name: true },
                    },
                    thumbnailImage: {
                        select: { secureUrl: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.category.findMany({
                where: {
                    name: { contains: query, mode: "insensitive" },
                },
                take: 3,
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