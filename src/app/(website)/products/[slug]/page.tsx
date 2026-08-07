import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetailClient, { ClientProductProps } from "./ProductDetailClient";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getProductDescription(product: { shortDescription?: string | null; fullDescription?: string | null }): string {
    return product.shortDescription || product.fullDescription || "";
}

function getPriceValidUntilDate(): string {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split("T")[0];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            brand: true,
            category: true,
            thumbnailImage: true,
            images: true,
        },
    });

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const primaryImage =
        product.thumbnailImage?.secureUrl ||
        product.images[0]?.secureUrl ||
        "/placeholder-product.png";

    const descriptionText =
        getProductDescription(product) ||
        `Buy wholesale ${product.name} from SN Trading. Premium bakery raw materials supplier.`;

    return {
        title: `${product.name} | Wholesale ${product.category?.name || "Products"}`,
        description: descriptionText,
        openGraph: {
            title: `${product.name} | SN Trading`,
            description: descriptionText,
            images: [
                {
                    url: primaryImage,
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            brand: true,
            category: true,
            thumbnailImage: true,
            images: true,
            variants: {
                orderBy: {
                    displayOrder: "asc",
                },
            },
            specifications: true,
            badges: {
                include: {
                    badge: true,
                },
            },
        },
    });

    if (!product) {
        notFound();
    }

    type ImageItem = (typeof product.images)[number];
    type BadgeItem = (typeof product.badges)[number];

    const primaryImage =
        product.thumbnailImage?.secureUrl ||
        product.images[0]?.secureUrl ||
        "/placeholder-product.png";

    const descriptionText = getProductDescription(product);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [primaryImage, ...product.images.map((img: ImageItem) => img.secureUrl)],
        description: descriptionText,
        brand: {
            "@type": "Brand",
            name: product.brand?.name || "SN Trading",
        },
        category: product.category?.name,
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            price: "0",
            priceValidUntil: getPriceValidUntilDate(),
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: "SN Trading",
            },
        },
    };

    const clientProductData: ClientProductProps = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        status: product.status,
        thumbnailImage: product.thumbnailImage,
        images: product.images,
        variants: product.variants,
        specifications: product.specifications,
    };

    return (
        <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div>
                {/* Header Information */}
                <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-1">
                        {product.brand && (
                            <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                {product.brand.name}
                            </span>
                        )}
                        {product.category && (
                            <span className="text-xs font-semibold text-slate-500">
                                Cat: {product.category.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                        {product.name}
                    </h1>

                    {descriptionText && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {descriptionText}
                        </p>
                    )}

                    {/* Badges */}
                    {product.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {product.badges.map(({ badge }: BadgeItem) => (
                                <span
                                    key={badge.id}
                                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                                >
                                    <ShieldCheck className="w-3 h-3" />
                                    {badge.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Unified Interactive Client Component */}
                <ProductDetailClient product={clientProductData} />
            </div>
        </main>
    );
}