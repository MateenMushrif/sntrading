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
            isFeatured,
            isLatest,
            thumbnailImageId,
            thumbnailImage,
            images,
            specifications,
            features,
            applications,
            variants,
        } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: "Missing required fields: name, slug" },
                { status: 400 }
            );
        }

        // Validate if thumbnailImageId exists in ProductImage table
        let validThumbnailImageId: string | undefined = undefined;
        if (typeof thumbnailImageId === "string" && thumbnailImageId.trim() !== "") {
            const existingImage = await prisma.productImage.findUnique({
                where: { id: thumbnailImageId.trim() },
            });
            if (existingImage) {
                validThumbnailImageId = existingImage.id;
            }
        }

        // Sanitize specifications
        const specsToCreate = Array.isArray(specifications)
            ? specifications
                .filter((s: { label?: string; value?: string }) => s.label?.trim() && s.value?.trim())
                .map((s: { label: string; value: string; displayOrder?: number }, idx: number) => ({
                    label: s.label.trim(),
                    value: s.value.trim(),
                    displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : idx + 1,
                }))
            : [];

        // Sanitize features
        const featuresToCreate = Array.isArray(features)
            ? features
                .filter((f: { feature?: string; text?: string }) => (f.feature || f.text)?.trim())
                .map((f: { feature?: string; text?: string; displayOrder?: number }, idx: number) => ({
                    feature: (f.feature || f.text || "").trim(),
                    displayOrder: typeof f.displayOrder === "number" ? f.displayOrder : idx + 1,
                }))
            : [];

        // Sanitize applications
        const applicationsToCreate = Array.isArray(applications)
            ? applications
                .filter((a: { application?: string; text?: string; name?: string }) =>
                    (a.application || a.text || a.name)?.trim()
                )
                .map((a: { application?: string; text?: string; name?: string; displayOrder?: number }, idx: number) => ({
                    application: (a.application || a.text || a.name || "").trim(),
                    displayOrder: typeof a.displayOrder === "number" ? a.displayOrder : idx + 1,
                }))
            : [];

        // Sanitize variants
        const variantsToCreate = Array.isArray(variants)
            ? variants
                .filter((v: { name?: string; weightOrSize?: string; size?: string }) =>
                    (v.name || v.weightOrSize || v.size)?.trim()
                )
                .map((v: {
                    name?: string;
                    weightOrSize?: string;
                    size?: string;
                    sku?: string;
                    displayOrder?: number;
                    imageId?: string;
                }, idx: number) => ({
                    name: (v.name || "Default Variant").trim(),
                    weightOrSize: (v.weightOrSize || v.size || "Default").trim(),
                    sku: v.sku?.trim() || null,
                    displayOrder: typeof v.displayOrder === "number" ? v.displayOrder : idx + 1,
                    imageId: v.imageId?.trim() || null,
                }))
            : [];

        // Sanitize gallery images
        const galleryToCreate = Array.isArray(images)
            ? images
                .filter((img: { secureUrl?: string }) => img.secureUrl?.trim())
                .map((img: { secureUrl: string; publicId?: string; altText?: string }, idx: number) => ({
                    cloudinaryPublicId: img.publicId || `prod_gallery_${Date.now()}_${idx}`,
                    secureUrl: img.secureUrl.trim(),
                    altText: img.altText || null,
                    displayOrder: idx + 1,
                    isThumbnail: false,
                }))
            : [];

        // Build strictly-typed ProductCreateInput payload
        const productData: Prisma.ProductCreateInput = {
            name: name.trim(),
            slug: slug.trim(),
            shortDescription: shortDescription?.trim() || description?.trim() || null,
            fullDescription: fullDescription?.trim() || description?.trim() || null,
            isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
            isLatest: typeof isLatest === "boolean" ? isLatest : false,
            category: categoryId ? { connect: { id: categoryId } } : undefined,
            brand: brandId ? { connect: { id: brandId } } : undefined,
            images: galleryToCreate.length > 0 ? { create: galleryToCreate } : undefined,
            specifications: specsToCreate.length > 0 ? { create: specsToCreate } : undefined,
            features: featuresToCreate.length > 0 ? { create: featuresToCreate } : undefined,
            applications: applicationsToCreate.length > 0 ? { create: applicationsToCreate } : undefined,
            variants: variantsToCreate.length > 0 ? { create: variantsToCreate } : undefined,
        };

        // Handle thumbnail creation or connection cleanly
        if (thumbnailImage && typeof thumbnailImage === "object" && thumbnailImage.secureUrl) {
            const imgData = thumbnailImage as { secureUrl: string; publicId?: string };
            productData.thumbnailImage = {
                create: {
                    cloudinaryPublicId: imgData.publicId || `prod_thumb_${Date.now()}`,
                    secureUrl: imgData.secureUrl,
                    isThumbnail: true,
                },
            };
        } else if (validThumbnailImageId) {
            productData.thumbnailImage = {
                connect: { id: validThumbnailImageId },
            };
        }

        const newProduct = await prisma.product.create({
            data: productData,
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
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: unknown) {
        console.error("POST /api/products error:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "A product with this slug already exists." },
                { status: 400 }
            );
        }

        const message = error instanceof Error ? error.message : "Failed to create product";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}