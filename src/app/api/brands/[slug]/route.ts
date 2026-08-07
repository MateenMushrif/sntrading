import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

function parseBoolean(val: unknown): boolean | undefined {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
        const trimmed = val.trim().toLowerCase();
        if (trimmed === "true" || trimmed === "1") return true;
        if (trimmed === "false" || trimmed === "0") return false;
    }
    if (typeof val === "number") return val === 1;
    return undefined;
}

// Helper: Query brand by Slug or ID using strict Prisma return typing
async function findBrandBySlugOrId(slugOrId: string) {
    const decoded = decodeURIComponent(slugOrId);
    return prisma.brand.findFirst({
        where: {
            OR: [
                { slug: decoded },
                { id: decoded },
            ],
        },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
}

// PUBLIC: Customer website brand details (lookup by Slug or ID fallback)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const brand = await findBrandBySlugOrId(slug);

        if (!brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        return NextResponse.json(brand);
    } catch (error: unknown) {
        console.error("GET /api/brands/[slug] error:", error);
        return NextResponse.json(
            { error: "Failed to fetch brand" },
            { status: 500 }
        );
    }
}

// PROTECTED: Admin update brand
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;
        const body: Record<string, unknown> = await request.json();

        const name = typeof body.name === "string" ? body.name : undefined;
        const providedSlug = typeof body.slug === "string" ? body.slug : undefined;
        const logo = typeof body.logo === "string" ? body.logo : undefined;
        const websiteUrl = typeof body.websiteUrl === "string" ? body.websiteUrl : undefined;
        const description = typeof body.description === "string" ? body.description : undefined;
        const parsedIsFeatured = parseBoolean(body.isFeatured);

        // Ensure record exists by slug or id
        const existingBrand = await findBrandBySlugOrId(slug);

        if (!existingBrand) {
            return NextResponse.json({ error: "Brand record not found" }, { status: 404 });
        }

        // Explicit Prisma update input
        const updateData: Prisma.BrandUpdateInput = {};

        if (name !== undefined) {
            if (name.trim() === "") {
                return NextResponse.json(
                    { error: "Brand name cannot be empty" },
                    { status: 400 }
                );
            }
            updateData.name = name.trim();

            updateData.slug = providedSlug || name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9 -]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
        } else if (providedSlug !== undefined) {
            updateData.slug = providedSlug;
        }

        if (logo !== undefined) updateData.logo = logo || null;
        if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl || null;
        if (description !== undefined) updateData.description = description || null;
        if (parsedIsFeatured !== undefined) updateData.isFeatured = parsedIsFeatured;

        const updatedBrand = await prisma.brand.update({
            where: { id: existingBrand.id },
            data: updateData,
        });

        // Purge storefront home page cache instantly on update
        revalidatePath("/");

        return NextResponse.json(updatedBrand);
    } catch (error: unknown) {
        console.error("PUT /api/brands/[slug] error:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "A brand with this slug already exists." },
                { status: 400 }
            );
        }

        const message = error instanceof Error ? error.message : "Failed to update brand";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// PROTECTED: Admin delete brand
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;
        const existingBrand = await findBrandBySlugOrId(slug);

        if (!existingBrand) {
            return NextResponse.json({ error: "Brand record not found" }, { status: 404 });
        }

        await prisma.brand.delete({
            where: { id: existingBrand.id },
        });

        // Purge storefront home page cache instantly on delete
        revalidatePath("/");

        return NextResponse.json({ success: true, message: "Brand deleted successfully" });
    } catch (error: unknown) {
        console.error("DELETE /api/brands/[slug] error:", error);
        const message = error instanceof Error ? error.message : "Failed to delete brand";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}