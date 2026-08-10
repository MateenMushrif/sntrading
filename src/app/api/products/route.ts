import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ✅ Helper function to parse boolean values from JSON payloads or strings
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

// 1️⃣ FAST LIGHTWEIGHT LISTING QUERY (Only exact fields needed for ProductCard.tsx)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)));
        const categorySlug = searchParams.get("category");
        const brandSlug = searchParams.get("brand");
        const search = searchParams.get("search")?.trim();

        const skip = (page - 1) * limit;
        const where: Prisma.ProductWhereInput = {};

        if (categorySlug) where.category = { slug: categorySlug };
        if (brandSlug) where.brand = { slug: brandSlug };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { shortDescription: { contains: search, mode: "insensitive" } },
            ];
        }

        // ✅ Ultra-light selection (Zero JOINs on variants, specs, or gallery images)
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    shortDescription: true,
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    thumbnailImage: {
                        select: { id: true, secureUrl: true, altText: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json(
            {
                data: products,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
            {
                headers: {
                    // Cache CDN responses for 2 minutes
                    "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// 2️⃣ POST ROUTE FOR PRODUCT CREATION
export async function POST(request: NextRequest) {
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

        let validThumbnailImageId: string | undefined = undefined;
        if (typeof thumbnailImageId === "string" && thumbnailImageId.trim() !== "") {
            const existingImage = await prisma.productImage.findUnique({
                where: { id: thumbnailImageId.trim() },
            });
            if (existingImage) {
                validThumbnailImageId = existingImage.id;
            }
        }

        const specsToCreate = Array.isArray(specifications)
            ? specifications
                .filter((s: { label?: string; value?: string }) => s.label?.trim() && s.value?.trim())
                .map((s: { label: string; value: string; displayOrder?: number }, idx: number) => ({
                    label: s.label.trim(),
                    value: s.value.trim(),
                    displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : idx + 1,
                }))
            : [];

        const featuresToCreate = Array.isArray(features)
            ? features
                .filter((f: { feature?: string; text?: string }) => (f.feature || f.text)?.trim())
                .map((f: { feature?: string; text?: string; displayOrder?: number }, idx: number) => ({
                    feature: (f.feature || f.text || "").trim(),
                    displayOrder: typeof f.displayOrder === "number" ? f.displayOrder : idx + 1,
                }))
            : [];

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

        const productData: Prisma.ProductCreateInput = {
            name: name.trim(),
            slug: slug.trim(),
            shortDescription: shortDescription?.trim() || description?.trim() || null,
            fullDescription: fullDescription?.trim() || description?.trim() || null,
            isFeatured: parseBoolean(isFeatured),
            isLatest: parseBoolean(isLatest),
            category: categoryId ? { connect: { id: categoryId } } : undefined,
            brand: brandId ? { connect: { id: brandId } } : undefined,
            images: galleryToCreate.length > 0 ? { create: galleryToCreate } : undefined,
            specifications: specsToCreate.length > 0 ? { create: specsToCreate } : undefined,
            features: featuresToCreate.length > 0 ? { create: featuresToCreate } : undefined,
            applications: applicationsToCreate.length > 0 ? { create: applicationsToCreate } : undefined,
            variants: variantsToCreate.length > 0 ? { create: variantsToCreate } : undefined,
        };

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

        revalidatePath("/");
        revalidatePath("/products");

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