import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Award, ArrowRight, Globe, Sparkles, Building2, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Authorized Bakery Brands | Wholesale Supplier",
    description:
        "Explore authentic bakery raw materials distributed directly from leading national and international manufacturers at SN Trading.",
    openGraph: {
        title: "Authorized Bakery Brands | SN Trading Wholesale",
        description:
            "Direct distribution of trusted commercial bakery ingredient manufacturers.",
    },
};

export default async function BrandsPage() {
    const brands = await prisma.brand.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            websiteUrl: true,
            isFeatured: true,
            _count: {
                select: { products: true },
            },
        },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    const featuredBrands = brands.filter((b) => b.isFeatured);
    const regularBrands = brands.filter((b) => !b.isFeatured);

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-10">
            {/* Hero Banner */}
            <div className="relative rounded-2xl bg-bg-off border border-border-subtle p-6 sm:p-8 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-accent/10 text-accent border border-accent/20">
                        <Award className="w-3.5 h-3.5" />
                        <span>Direct Factory Distribution</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                        Authorized Bakery Brands
                    </h1>

                    <p className="text-xs text-text-muted leading-relaxed">
                        We distribute authentic raw materials directly from leading national and international commercial bakery manufacturers.
                    </p>
                </div>
            </div>

            {/* Featured Brands Section */}
            {featuredBrands.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                            Featured Partners
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featuredBrands.map((brand) => (
                            <div
                                key={brand.id}
                                className="group relative rounded-xl bg-bg-main border border-accent/40 hover:border-accent p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative w-16 h-16 rounded-lg bg-bg-off border border-border-subtle p-2 flex items-center justify-center shrink-0 group-hover:bg-accent/5 transition-colors overflow-hidden">
                                        {brand.logo ? (
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                fill
                                                sizes="64px"
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-accent" />
                                        )}
                                    </div>

                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-base font-bold text-primary truncate group-hover:text-accent transition-colors">
                                                {brand.name}
                                            </h3>
                                            <span className="shrink-0 px-2 py-0.5 rounded text-xs font-extrabold bg-accent/10 text-accent border border-accent/20">
                                                FEATURED
                                            </span>
                                        </div>

                                        <p className="text-xs text-text-muted line-clamp-2">
                                            {brand.description || "Official manufacturing partner supplying commercial bakery raw materials."}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-extrabold">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-primary">
                                            <Package className="w-3.5 h-3.5 text-accent" />
                                            {brand._count.products} Products
                                        </span>

                                        {brand.websiteUrl && (
                                            <a
                                                href={brand.websiteUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-text-muted hover:text-accent transition-colors"
                                            >
                                                <Globe className="w-3 h-3" />
                                                <span>Website</span>
                                            </a>
                                        )}
                                    </div>

                                    <Link
                                        href={`/brands/${brand.slug}`}
                                        className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform"
                                    >
                                        <span>View Catalogue</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Brand Partners Grid */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                        All Brand Partners
                    </h2>
                    <span className="text-xs font-bold text-text-muted">
                        {brands.length} Direct Vendors
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(featuredBrands.length > 0 ? regularBrands : brands).map((brand) => (
                        <div
                            key={brand.id}
                            className="group rounded-xl bg-bg-main border border-border-subtle hover:border-accent p-4 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-lg bg-bg-off border border-border-subtle p-1.5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors overflow-hidden">
                                        {brand.logo ? (
                                            <Image
                                                src={brand.logo}
                                                alt={brand.name}
                                                fill
                                                sizes="48px"
                                                className="object-contain p-1.5"
                                            />
                                        ) : (
                                            <Award className="w-6 h-6 text-accent" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-primary truncate group-hover:text-accent transition-colors">
                                            {brand.name}
                                        </h3>
                                        <span className="text-xs font-extrabold text-text-muted">
                                            {brand._count.products} SKUs Available
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-text-muted line-clamp-2">
                                    {brand.description || "Official manufacturer and supplier partner."}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-extrabold">
                                {brand.websiteUrl ? (
                                    <a
                                        href={brand.websiteUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-text-muted hover:text-accent transition-colors"
                                    >
                                        <Globe className="w-3 h-3" />
                                        <span>Website</span>
                                    </a>
                                ) : (
                                    <span className="text-text-muted">Direct Supplier</span>
                                )}

                                <Link
                                    href={`/brands/${brand.slug}`}
                                    className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform"
                                >
                                    <span>View Catalogue</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}