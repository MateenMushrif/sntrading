import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allows Vercel serverless execution up to 60s

interface BulkProductRow {
    name: string;
    slug: string;
    categorySlug: string;
    brandSlug: string;
    imageUrl?: string;
    shortDescription?: string;
    isFeatured?: boolean;
    variantName?: string;
    variantSize?: string;
    variantSku?: string;
    specLabel?: string;
    specValue?: string;
}

export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = (await request.json()) as { products?: BulkProductRow[] };
        const products = body.products;

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: "No product data provided." }, { status: 400 });
        }

        const [categories, brands] = await Promise.all([
            prisma.category.findMany({ select: { id: true, slug: true } }),
            prisma.brand.findMany({ select: { id: true, slug: true } }),
        ]);

        const categoryMap = new Map(categories.map((c) => [c.slug.toLowerCase(), c.id]));
        const brandMap = new Map(brands.map((b) => [b.slug.toLowerCase(), b.id]));

        const createdProducts = [];
        const errors: string[] = [];

        await prisma.$transaction(
            async (tx) => {
                for (let i = 0; i < products.length; i++) {
                    const item = products[i];
                    const rowNum = i + 1;

                    if (!item.name || !item.slug) {
                        errors.push(`Row ${rowNum}: Missing product name or slug.`);
                        continue;
                    }

                    const catId = categoryMap.get((item.categorySlug || "").toLowerCase());
                    const brandId = brandMap.get((item.brandSlug || "").toLowerCase());

                    if (!catId) {
                        errors.push(`Row ${rowNum} ("${item.name}"): Category slug "${item.categorySlug}" not found.`);
                        continue;
                    }

                    if (!brandId) {
                        errors.push(`Row ${rowNum} ("${item.name}"): Brand slug "${item.brandSlug}" not found.`);
                        continue;
                    }

                    // Create Product with nested variants & specifications
                    const created = await tx.product.create({
                        data: {
                            name: item.name.trim(),
                            slug: item.slug.trim().toLowerCase(),
                            shortDescription: item.shortDescription?.trim() || null,
                            isFeatured: Boolean(item.isFeatured),
                            categoryId: catId,
                            brandId: brandId,
                            variants: (item.variantName || item.variantSize) ? {
                                create: [
                                    {
                                        name: item.variantName?.trim() || "Standard Packaging",
                                        weightOrSize: item.variantSize?.trim() || "1kg Pack",
                                        sku: item.variantSku?.trim() || null,
                                        displayOrder: 1,
                                    }
                                ]
                            } : undefined,
                            specifications: (item.specLabel && item.specValue) ? {
                                create: [
                                    {
                                        label: item.specLabel.trim(),
                                        value: item.specValue.trim(),
                                        displayOrder: 1,
                                    }
                                ]
                            } : undefined,
                        },
                    });

                    // Attach Image URL if provided
                    if (item.imageUrl?.trim()) {
                        const createdImage = await tx.productImage.create({
                            data: {
                                productId: created.id,
                                cloudinaryPublicId: `bulk_import_${Date.now()}_${i}`,
                                secureUrl: item.imageUrl.trim(),
                                isThumbnail: true,
                            },
                        });

                        await tx.product.update({
                            where: { id: created.id },
                            data: { thumbnailImageId: createdImage.id },
                        });
                    }

                    createdProducts.push(created);
                }
            },
            {
                maxWait: 10000, // 10s max pool acquisition wait
                timeout: 60000, // 60s interactive transaction timeout
            }
        );

        revalidatePath("/");
        revalidatePath("/products");

        return NextResponse.json({
            success: true,
            totalCreated: createdProducts.length,
            errors,
        });
    } catch (error: unknown) {
        console.error("POST /api/products/bulk error:", error);
        return NextResponse.json(
            { error: "Failed to process bulk product import." },
            { status: 500 }
        );
    }
}