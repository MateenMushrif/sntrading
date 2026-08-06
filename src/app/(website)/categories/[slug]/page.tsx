import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import { ArrowLeft, Layers, Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// 1. Dynamic Metadata Generator for Category SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    // Try finding by slug, fallback to ID lookup
    let category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) {
        category = await prisma.category.findUnique({
            where: { id: slug },
        });
    }

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    const title = `${category.name} | Wholesale Bakery Ingredients`;
    const description = category.description
        ? category.description
        : `Bulk supply of commercial grade ${category.name} for bakeries and food manufacturers from SN Trading.`;

    const imageUrl = typeof category.image === "string" ? category.image : null;

    return {
        title,
        description,
        openGraph: {
            title: `${category.name} - Bulk Wholesale | SN Trading`,
            description,
            ...(imageUrl && {
                images: [{ url: imageUrl, alt: category.name }],
            }),
        },
    };
}

export default async function CategoryDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Query 1: Primary lookup by slug
    let category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                include: {
                    brand: true,
                    category: true,
                    thumbnailImage: true,
                    images: true,
                    variants: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    // Query 2: Fallback lookup by CUID/ID for backward compatibility
    if (!category) {
        category = await prisma.category.findUnique({
            where: { id: slug },
            include: {
                products: {
                    include: {
                        brand: true,
                        category: true,
                        thumbnailImage: true,
                        images: true,
                        variants: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        // If found via ID, perform a permanent 308 redirect to the canonical slug URL
        if (category?.slug) {
            redirect(`/categories/${category.slug}`);
        }
    }

    if (!category) {
        notFound();
    }

    const imageUrl = typeof category.image === "string" ? category.image : null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        description: category.description || `Wholesale supply of ${category.name}`,
        url: `https://sntrading.com/categories/${category.slug}`,
        ...(imageUrl && { image: imageUrl }),
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: category.products.length,
            itemListElement: category.products.map((prod, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: prod.name,
                url: `https://sntrading.com/products/${prod.slug || prod.id}`,
            })),
        },
    };

    return (
        <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Back Button */}
            <Link
                href="/categories"
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-amber-600"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Categories
            </Link>

            {/* Hero Header Banner */}
            <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-xs sm:p-5">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="max-w-xl space-y-1.5">
                        <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-amber-600">
                            <Package className="h-3 w-3" />
                            <span>{category.products.length} Products Available</span>
                        </div>

                        <h1 className="text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">
                            {category.name}
                        </h1>

                        {category.description && (
                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Image Box */}
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white sm:h-24 sm:w-44">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={category.name}
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, 176px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-2 text-slate-400">
                                <div className="mb-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
                                    <Layers className="h-4 w-4 text-amber-500" />
                                </div>
                                <span className="max-w-full truncate font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
                                    {category.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product List */}
            {category.products.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="mb-1 text-xs font-bold text-slate-900">
                        No products listed under this category yet.
                    </p>
                    <p className="text-xs text-slate-500">
                        Check back soon or contact SN Trading for direct bulk inquiry.
                    </p>
                </div>
            ) : (
                <ProductGrid products={category.products} />
            )}
        </main>
    );
}