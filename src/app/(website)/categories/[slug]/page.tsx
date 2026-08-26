import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import { ArrowLeft, Layers, Package } from "lucide-react";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const getCachedCategory = cache(async (slug: string) => {
    let category = await prisma.category.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            products: {
                where: { status: "ACTIVE" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    shortDescription: true,
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    brand: {
                        select: { id: true, name: true, slug: true },
                    },
                    thumbnailImage: {
                        select: { id: true, secureUrl: true, altText: true },
                    },
                    specifications: {
                        select: { id: true, label: true, value: true },
                        orderBy: { displayOrder: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!category) {
        category = await prisma.category.findUnique({
            where: { id: slug },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                products: {
                    where: { status: "ACTIVE" },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        shortDescription: true,
                        category: {
                            select: { id: true, name: true, slug: true },
                        },
                        brand: {
                            select: { id: true, name: true, slug: true },
                        },
                        thumbnailImage: {
                            select: { id: true, secureUrl: true, altText: true },
                        },
                        specifications: {
                            select: { id: true, label: true, value: true },
                            orderBy: { displayOrder: "asc" },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }

    return category;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCachedCategory(slug);

    if (!category) {
        return { title: "Category Not Found" };
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
    const category = await getCachedCategory(slug);

    if (!category) {
        notFound();
    }

    if (slug !== category.slug) {
        redirect(`/categories/${category.slug}`);
    }

    const imageUrl = typeof category.image === "string" ? category.image : null;

    return (
        <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 space-y-6">
            <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-accent transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to All Categories
            </Link>

            {/* Clean Category Hero Banner */}
            <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-off p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs">
                            <Package className="h-3.5 w-3.5 text-accent" />
                            <span>{category.products.length} Products in Catalog</span>
                        </div>

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-text-main">
                            {category.name}
                        </h1>

                        {category.description && (
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Proportional Rounded Category Image Preview */}
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-bg-main shadow-xs">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={category.name}
                                fill
                                priority
                                sizes="(max-width: 640px) 112px, 144px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-accent bg-bg-off">
                                <Layers className="h-8 w-8 text-accent" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Grid Section */}
            {category.products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-subtle bg-bg-main p-12 text-center space-y-1">
                    <p className="text-sm font-bold text-text-main">
                        No products currently listed under this category.
                    </p>
                    <p className="text-xs text-text-muted">
                        Check back soon or contact our sales desk for direct factory quotes.
                    </p>
                </div>
            ) : (
                <ProductGrid
                    products={category.products as Product[]}
                    gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3"
                />
            )}
        </main>
    );
}