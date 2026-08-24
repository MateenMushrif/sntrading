import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [products, categories] = await Promise.all([
            prisma.product.findMany({
                where: { status: "ACTIVE" },
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
                orderBy: { name: "asc" },
            }),
            prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
                orderBy: { name: "asc" },
            }),
        ]);

        return NextResponse.json(
            { products, categories },
            {
                headers: {
                    // Edge Cache for 1 hour, serve stale up to 24h while revalidating
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                },
            }
        );
    } catch (error) {
        console.error("Failed to build search catalog index:", error);
        return NextResponse.json({ products: [], categories: [] }, { status: 500 });
    }
}