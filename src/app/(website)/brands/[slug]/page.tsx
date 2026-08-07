import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Building2, Package, Award, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const brand = await prisma.brand.findUnique({
        where: { slug },
    });

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

    const brand = await prisma.brand.findUnique({
        where: { slug },
        include: {
            products: {
                include: {
                    category: true,
                    thumbnailImage: true,
                    images: true,
                    variants: true,
                    specifications: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!brand) {
        notFound();
    }

    // Map Prisma products to flatten the brand field with explicit element typing
    const formattedProducts = brand.products.map((product: (typeof brand.products)[number]) => ({
        ...product,
        brand: brand.name, // Supplies the brand string expected by ProductGrid
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Brand",
        name: brand.name,
        description: brand.description || `Commercial bakery products by ${brand.name}`,
        url: brand.websiteUrl || `https://sntrading.com/brands/${brand.slug}`,
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: brand.products.length,
            itemListElement: brand.products.map((prod: (typeof brand.products)[number], index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                name: prod.name,
                url: `https://sntrading.com/products/${prod.slug}`,
            })),
        },
    };

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-8">
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

                <span className="text-2xs font-extrabold text-text-muted uppercase tracking-wider font-mono">
                    Direct Distribution
                </span>
            </div>

            <div className="relative rounded-2xl bg-bg-off border border-border-subtle p-6 sm:p-8 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-5">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-bg-main border border-border-subtle p-3 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    sizes="(max-width: 640px) 80px, 96px"
                                    className="object-contain p-2"
                                />
                            ) : (
                                <Building2 className="w-10 h-10 text-accent" />
                            )}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                                    {brand.name}
                                </h1>

                                {brand.isFeatured && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-extrabold bg-accent/10 text-accent border border-accent/20">
                                        <Sparkles className="w-3 h-3" />
                                        <span>FEATURED PARTNER</span>
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
                                {brand.description ||
                                    `Authorized commercial wholesale catalog for ${brand.name} bakery raw materials and professional ingredients.`}
                            </p>

                            <div className="flex items-center gap-4 pt-1 text-2xs font-extrabold text-primary">
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
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all shrink-0 self-start md:self-center shadow-2xs"
                        >
                            <span>Official Website</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                    Product Catalog
                </h2>
                <span className="text-2xs font-bold text-text-muted">
                    Showing {brand.products.length} SKUs
                </span>
            </div>

            {formattedProducts.length === 0 ? (
                <div className="bg-bg-off border border-border-subtle rounded-2xl p-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent mb-2">
                        <Package className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-primary">
                        No Products Listed Under {brand.name} Yet
                    </p>
                    <p className="text-xs text-text-muted max-w-md mx-auto">
                        We are currently updating our inventory catalog. Check back soon or contact SN Trading directly for specific inquiries.
                    </p>
                </div>
            ) : (
                <ProductGrid products={formattedProducts as unknown as React.ComponentProps<typeof ProductGrid>['products']} />
            )}
        </main>
    );
}