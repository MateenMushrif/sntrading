import { NextRequest, NextResponse } from "next/server";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Temporary in-memory / file cache store for published layout config
let globalStorefrontConfig = {
    sections: [
        { id: "sec-hero", type: "hero", title: "Hero Carousel", enabled: true, columns: 4 },
        { id: "sec-search-categories", type: "search_categories", title: "Featured Categories", enabled: true, columns: 6 },
        { id: "sec-featured-products", type: "featured_products", title: "Featured Bakery Products", enabled: true, columns: 6 },
    ],
    slides: [],
    autoPlayInterval: 4000,
};

export async function GET() {
    return NextResponse.json(globalStorefrontConfig, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
    });
}

export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        globalStorefrontConfig = {
            ...globalStorefrontConfig,
            ...body,
        };

        // Purge Next.js homepage cache so public visitors see updated layout instantly
        revalidatePath("/");

        return NextResponse.json({ success: true, config: globalStorefrontConfig });
    } catch (error) {
        console.error("POST /api/storefront/config error:", error);
        return NextResponse.json({ error: "Failed to update storefront config" }, { status: 500 });
    }
}