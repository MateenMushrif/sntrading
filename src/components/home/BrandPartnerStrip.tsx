import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronRight, Package, ArrowRight } from "lucide-react";

interface BrandItem {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    _count?: { products: number };
}

export default function BrandPartnerStrip({ brands }: { brands: BrandItem[] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
                    <h2 className="text-sm font-bold text-text-main sm:text-lg tracking-tight">
                        Authorized Brands & Mill Partners
                    </h2>
                </div>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    All Brands <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Dense, auto-wrapping compact pill strips */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="group flex h-12 sm:h-14 w-full sm:w-52 md:w-56 lg:w-60 items-center overflow-hidden rounded-xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md select-none"
                    >
                        {/* Left Flush Square Thumbnail (100% height, fixed square) */}
                        <div className="relative aspect-square h-full shrink-0 border-r border-border-subtle bg-bg-off flex items-center justify-center overflow-hidden">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                                    sizes="56px"
                                />
                            ) : (
                                <Building2 className="h-5 w-5 text-accent" />
                            )}
                        </div>

                        {/* Right Content */}
                        <div className="flex flex-1 items-center justify-between px-2.5 min-w-0">
                            <div className="min-w-0 pr-1.5">
                                <h3 className="truncate text-xs font-bold text-text-main group-hover:text-accent transition-colors">
                                    {brand.name}
                                </h3>
                                <div className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                                    <Package className="h-3 w-3 text-accent shrink-0" />
                                    <span className="truncate">
                                        {brand._count?.products ? `${brand._count.products} SKUs` : "Catalog"}
                                    </span>
                                </div>
                            </div>

                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}