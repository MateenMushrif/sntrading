import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function parseBoolean(val: unknown): boolean {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
        const trimmed = val.trim().toLowerCase();
        if (trimmed === "true" || trimmed === "1") return true;
        if (trimmed === "false" || trimmed === "0") return false;
    }
    if (typeof val === "number") return val === 1;
    return false;
}

// PUBLIC: Customer website browsing
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

// PROTECTED: Admin dashboard creation
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const { name, slug, description, image, isFeatured, displayOrder } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "Missing required fields: name, slug" },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                slug: slug.trim(),
                description: typeof description === "string" ? description.trim() || null : null,
                image: typeof image === "string" ? image : null,
                isFeatured: parseBoolean(isFeatured),
                displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
            },
        });

        // ✅ Purge storefront home page cache instantly on creation
        revalidatePath("/");

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("POST /api/categories error:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}