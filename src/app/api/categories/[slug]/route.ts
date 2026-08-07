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

async function findCategoryBySlugOrId(slugOrId: string) {
    const decoded = decodeURIComponent(slugOrId);
    return prisma.category.findFirst({
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

// PUBLIC: Fetch single category
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const category = await findCategoryBySlugOrId(slug);

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error: unknown) {
        console.error("GET /api/categories/[slug] error:", error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}

// PROTECTED: Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;
        const body: Record<string, unknown> = await request.json();

        const existingCategory = await findCategoryBySlugOrId(slug);

        if (!existingCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Build precise update payload so undefined properties don't wipe existing DB fields
        const updateData: Prisma.CategoryUpdateInput = {};

        if (typeof body.name === "string" && body.name.trim() !== "") {
            updateData.name = body.name.trim();
        }

        if (typeof body.slug === "string" && body.slug.trim() !== "") {
            updateData.slug = body.slug.trim();
        }

        if (typeof body.description === "string") {
            updateData.description = body.description.trim() || null;
        }

        // Handle image updates explicitly (accepts string URL or null to clear)
        if (typeof body.image === "string" || body.image === null) {
            updateData.image = body.image;
        }

        const parsedIsFeatured = parseBoolean(body.isFeatured);
        if (parsedIsFeatured !== undefined) {
            updateData.isFeatured = parsedIsFeatured;
        }

        if (body.displayOrder !== undefined) {
            updateData.displayOrder = Number(body.displayOrder);
        }

        const category = await prisma.category.update({
            where: { id: existingCategory.id },
            data: updateData,
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        // ✅ Purge storefront home page cache instantly on update
        revalidatePath("/");

        return NextResponse.json(category);
    } catch (error: unknown) {
        console.error("PUT /api/categories/[slug] error:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "A category with this slug already exists." },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

// PROTECTED: Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;
        const existingCategory = await findCategoryBySlugOrId(slug);

        if (!existingCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        await prisma.category.delete({
            where: { id: existingCategory.id },
        });

        // ✅ Purge storefront home page cache instantly on delete
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("DELETE /api/categories/[slug] error:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}