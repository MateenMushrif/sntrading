import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// Robust boolean parser handling booleans, strings ("true"/"false"), and numbers (1/0)
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

const productIncludeConfig = {
    brand: true,
    category: true,
    thumbnailImage: true,
    images: {
        orderBy: { displayOrder: "asc" as const },
    },
    variants: {
        orderBy: { displayOrder: "asc" as const },
    },
    specifications: {
        orderBy: { displayOrder: "asc" as const },
    },
    features: {
        orderBy: { displayOrder: "asc" as const },
    },
    applications: {
        orderBy: { displayOrder: "asc" as const },
    },
    badges: {
        include: { badge: true },
    },
};

async function findProductBySlugOrId(slugOrId: string) {
    const decoded = decodeURIComponent(slugOrId);
    return prisma.product.findFirst({
        where: {
            OR: [
                { slug: decoded },
                { id: decoded },
            ],
        },
        include: productIncludeConfig,
    });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const product = await findProductBySlugOrId(slug);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error("GET /api/products/[slug] error:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;
        const body = (await request.json()) as Record<string, unknown>;

        const existing = await findProductBySlugOrId(slug);
        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const updateData: Prisma.ProductUncheckedUpdateInput = {};

        // Parse boolean fields reliably
        const parsedIsFeatured = parseBoolean(body.isFeatured);
        if (parsedIsFeatured !== undefined) {
            updateData.isFeatured = parsedIsFeatured;
        }

        const parsedIsLatest = parseBoolean(body.isLatest);
        if (parsedIsLatest !== undefined) {
            updateData.isLatest = parsedIsLatest;
        }

        if (typeof body.name === "string" && body.name.trim() !== "") {
            updateData.name = body.name.trim();
        }
        if (typeof body.slug === "string" && body.slug.trim() !== "") {
            updateData.slug = body.slug.trim();
        }
        if (typeof body.description === "string") {
            updateData.shortDescription = body.description;
        } else if (typeof body.shortDescription === "string") {
            updateData.shortDescription = body.shortDescription;
        }
        if (typeof body.fullDescription === "string") {
            updateData.fullDescription = body.fullDescription;
        }
        if (typeof body.categoryId === "string") {
            updateData.categoryId = body.categoryId;
        }
        if (typeof body.brandId === "string") {
            updateData.brandId = body.brandId;
        }

        // 1. Handle Thumbnail Image Creation
        let currentThumbnailId = existing.thumbnailImageId;
        if (body.thumbnailImage && typeof body.thumbnailImage === "object") {
            const imgData = body.thumbnailImage as { secureUrl?: string; publicId?: string };
            if (imgData.secureUrl) {
                const pubId = imgData.publicId || `prod_thumb_${Date.now()}`;
                const createdImage = await prisma.productImage.create({
                    data: {
                        cloudinaryPublicId: pubId,
                        secureUrl: imgData.secureUrl,
                        productId: existing.id,
                        isThumbnail: true,
                    },
                });
                updateData.thumbnailImageId = createdImage.id;
                currentThumbnailId = createdImage.id;
            }
        } else if (typeof body.thumbnailImageId === "string" && body.thumbnailImageId.trim() !== "") {
            updateData.thumbnailImageId = body.thumbnailImageId;
            currentThumbnailId = body.thumbnailImageId;
        }

        // 2. Handle Multi-Image Gallery Payload
        if (Array.isArray(body.images)) {
            await prisma.productImage.deleteMany({
                where: {
                    productId: existing.id,
                    isThumbnail: false,
                    ...(currentThumbnailId ? { id: { not: currentThumbnailId } } : {}),
                },
            });

            const galleryItems = body.images as Array<{ secureUrl: string; publicId?: string; altText?: string }>;

            const thumbnailImgRecord = currentThumbnailId
                ? await prisma.productImage.findUnique({ where: { id: currentThumbnailId } })
                : null;
            const thumbnailUrl = thumbnailImgRecord?.secureUrl;

            const seenUrls = new Set<string>();
            if (thumbnailUrl) seenUrls.add(thumbnailUrl);

            for (let i = 0; i < galleryItems.length; i++) {
                const img = galleryItems[i];
                if (img.secureUrl && !seenUrls.has(img.secureUrl)) {
                    seenUrls.add(img.secureUrl);
                    await prisma.productImage.create({
                        data: {
                            productId: existing.id,
                            cloudinaryPublicId: img.publicId || `prod_gallery_${Date.now()}_${i}`,
                            secureUrl: img.secureUrl,
                            altText: img.altText || null,
                            displayOrder: i + 1,
                            isThumbnail: false,
                        },
                    });
                }
            }
        }

        // 3. Handle Packaging Variants Update
        if (Array.isArray(body.variants)) {
            await prisma.productVariant.deleteMany({
                where: { productId: existing.id },
            });

            const newVariants = body.variants.map((v: { name?: string; weightOrSize?: string; sku?: string }, index: number) => ({
                productId: existing.id,
                name: v.name || "Standard",
                weightOrSize: v.weightOrSize || "1kg",
                sku: v.sku || null,
                displayOrder: index + 1,
            }));

            if (newVariants.length > 0) {
                await prisma.productVariant.createMany({
                    data: newVariants,
                });
            }
        }

        // 4. Handle Specifications Update
        if (Array.isArray(body.specifications)) {
            await prisma.productSpecification.deleteMany({
                where: { productId: existing.id },
            });

            const newSpecs = body.specifications
                .filter((s: { label?: string; value?: string }) => s.label?.trim() && s.value?.trim())
                .map((s: { label: string; value: string; displayOrder?: number }, index: number) => ({
                    productId: existing.id,
                    label: s.label.trim(),
                    value: s.value.trim(),
                    displayOrder: typeof s.displayOrder === "number" ? s.displayOrder : index + 1,
                }));

            if (newSpecs.length > 0) {
                await prisma.productSpecification.createMany({
                    data: newSpecs,
                });
            }
        }

        const updated = await prisma.product.update({
            where: { id: existing.id },
            data: updateData,
            include: productIncludeConfig,
        });

        // ✅ Purge storefront home page cache instantly on update
        revalidatePath("/");

        return NextResponse.json(updated);
    } catch (error: unknown) {
        console.error("PUT /api/products/[slug] error:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "A product with this slug already exists." },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { slug } = await params;

        const existing = await findProductBySlugOrId(slug);
        if (!existing) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await prisma.product.delete({ where: { id: existing.id } });

        // ✅ Purge storefront home page cache instantly on delete
        revalidatePath("/");

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: unknown) {
        console.error("DELETE /api/products/[slug] error:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}