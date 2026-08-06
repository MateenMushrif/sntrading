import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateDeviceToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    // Read operations (GET) are public for customer website browsing
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));
        const categorySlug = searchParams.get("category");
        const brandSlug = searchParams.get("brand");
        const search = searchParams.get("search")?.trim();

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {};

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (brandSlug) {
            where.brand = { slug: brandSlug };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { variants: { some: { sku: { contains: search, mode: "insensitive" } } } },
                { variants: { some: { name: { contains: search, mode: "insensitive" } } } },
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    brand: true,
                    category: true,
                    thumbnailImage: true,
                    images: { orderBy: { displayOrder: "asc" } },
                    variants: { orderBy: { displayOrder: "asc" } },
                    specifications: { orderBy: { displayOrder: "asc" } },
                    features: { orderBy: { displayOrder: "asc" } },
                    applications: { orderBy: { displayOrder: "asc" } },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Hardware Token Validation enforced for administrative creations
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const {
            name,
            slug,
            description,
            shortDescription,
            fullDescription,
            categoryId,
            brandId,
            thumbnailImageId,
            specifications,
            features,
            applications,
            variants,
        } = body;

        if (!name || !slug || !categoryId || !brandId) {
            return NextResponse.json(
                { error: "Missing required fields: name, slug, categoryId, brandId" },
                { status: 400 }
            );
        }

        // Sanitize and format specifications payload
        const specsToCreate = Array.isArray(specifications)
            ? specifications
                .filter((s: { label?: string; value?: string }) => s.label?.trim() && s.value?.trim())
                .map((s: { label: string; value: string; displayOrder?: number }, idx: number) => ({
                    label: s.label.trim(),
                    value: s.value.trim(),
                    displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : idx + 1,
                }))
            : undefined;

        const newProduct = await prisma.product.create({
            data: {
                name,
                slug,
                shortDescription: shortDescription || description || null,
                fullDescription: fullDescription || description || null,
                categoryId,
                brandId,
                thumbnailImageId,
                specifications: specsToCreate && specsToCreate.length > 0 ? { create: specsToCreate } : undefined,
                features: features ? { create: features } : undefined,
                applications: applications ? { create: applications } : undefined,
                variants: variants ? { create: variants } : undefined,
            },
            include: {
                brand: true,
                category: true,
                thumbnailImage: true,
                images: { orderBy: { displayOrder: "asc" } },
                variants: { orderBy: { displayOrder: "asc" } },
                specifications: { orderBy: { displayOrder: "asc" } },
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("POST /api/products error:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}