import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { ArrowLeft, ExternalLink, Building2, Package, Award, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const getCachedBrand = cache(async (slug: string) => {
    return prisma.brand.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            websiteUrl: true,
            isFeatured: true,
            products: {
                where: { status: "ACTIVE" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
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
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const brand = await getCachedBrand(slug);

    if (!brand) {
        return {
            title: "Brand Not Found",
        };
    }

    const title = `${brand.name} Wholesale Products | SN Trading`;
    const description = brand.description
        ? brand.description
        : `Wholesale supplier of certified ${brand.name} bakery ingredients and raw materials.`;

    return {
        title,
        description,
        openGraph: {
            title: `${brand.name} Bakery Ingredients - Wholesale`,
            description,
        },
    };
}

export default async function BrandDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const brand = await getCachedBrand(slug);

    if (!brand) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Brand",
        name: brand.name,
        description: brand.description || `Commercial bakery products by ${brand.name}`,
        url: brand.websiteUrl || `https://sntrading.com/brands/${brand.slug}`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: brand.products.length,
            itemListElement: brand.products.map((prod, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                name: prod.name,
                url: `https://sntrading.com/products/${prod.slug}`,
            })),
        },
    };

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 space-y-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="flex items-center justify-between">
                <Link
                    href="/brands"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Brand Partners</span>
                </Link>

                <span className="text-xs font-black text-text-muted uppercase tracking-wider">
                    Direct Distribution
                </span>
            </div>

            {/* Brand Hero Banner with Soft Background Glow Orb */}
            <div className="relative rounded-2xl bg-bg-off border border-border-subtle p-6 sm:p-8 shadow-xs overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-bg-main border border-border-subtle p-3 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    sizes="(max-width: 640px) 80px, 96px"
                                    className="object-contain p-2"
                                    priority
                                />
                            ) : (
                                <Building2 className="w-10 h-10 text-accent" />
                            )}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-text-main tracking-tight uppercase">
                                    {brand.name}
                                </h1>

                                {brand.isFeatured && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-badge-amber-bg text-badge-amber border border-accent/20">
                                        <Sparkles className="w-3 h-3" />
                                        <span>FEATURED PARTNER</span>
                                    </span>
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
                                {brand.description ||
                                    `Authorized commercial wholesale catalog for ${brand.name} bakery raw materials and professional ingredients.`}
                            </p>

                            <div className="flex items-center gap-4 pt-1 text-xs font-bold text-text-main">
                                <span className="flex items-center gap-1">
                                    <Package className="w-3.5 h-3.5 text-accent" />
                                    {brand.products.length} Products Listed
                                </span>

                                <span className="flex items-center gap-1 text-text-muted">
                                    <Award className="w-3.5 h-3.5 text-accent" />
                                    Guaranteed Authentic
                                </span>
                            </div>
                        </div>
                    </div>

                    {brand.websiteUrl && (
                        <a
                            href={brand.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-text-main bg-bg-main border border-border-subtle hover:border-accent hover:text-accent transition-all shrink-0 self-start md:self-center shadow-xs"
                        >
                            <span>Official Website</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>

            {/* Catalog Section Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h2 className="text-xs sm:text-sm font-black text-text-main uppercase tracking-wider">
                    Product Catalog
                </h2>
                <span className="text-xs font-bold text-text-muted">
                    Showing {brand.products.length} SKUs
                </span>
            </div>

            {/* Products Grid */}
            {brand.products.length === 0 ? (
                <div className="bg-bg-off border border-dashed border-border-subtle rounded-2xl p-12 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-badge-amber-bg border border-accent/20 flex items-center justify-center mx-auto text-badge-amber mb-2">
                        <Package className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-text-main">
                        No Products Listed Under {brand.name} Yet
                    </p>
                    <p className="text-xs text-text-muted max-w-md mx-auto">
                        We are currently updating our inventory catalog. Check back soon or contact SN Trading directly for specific inquiries.
                    </p>
                </div>
            ) : (
                <ProductGrid
                    products={brand.products as Product[]}
                    gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3"
                />
            )}
        </main>
    );
}