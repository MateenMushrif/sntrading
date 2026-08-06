import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PUBLIC: Customer website browsing
export async function GET() {
    try {
        const brands = await prisma.brand.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error("GET /api/brands error:", error);
        return NextResponse.json(
            { error: "Failed to fetch brands" },
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
        const { name, slug: providedSlug, logo, websiteUrl, description, isFeatured } = body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Missing required field: name" },
                { status: 400 }
            );
        }

        const slug = providedSlug || name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        const brand = await prisma.brand.create({
            data: {
                name: name.trim(),
                slug,
                logo: logo || null,
                websiteUrl: websiteUrl || null,
                description: description || null,
                isFeatured: Boolean(isFeatured),
            },
        });

        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        console.error("POST /api/brands error:", error);
        const message = error instanceof Error ? error.message : "Failed to create brand";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}