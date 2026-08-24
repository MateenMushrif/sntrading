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
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-bold text-text-main sm:text-lg tracking-tight">
                        Authorized Brands & Mill Partners
                    </h2>
                </div>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    All Brands <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Auto-wrapping layout with capped card width */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="group flex h-20 w-full max-w-xs sm:max-w-sm items-center overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg select-none"
                    >
                        {/* Left Full-Height Square Logo Frame */}
                        <div className="relative aspect-square h-full shrink-0 border-r border-border-subtle bg-bg-off flex items-center justify-center overflow-hidden">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
                                    sizes="80px"
                                />
                            ) : (
                                <Building2 className="h-6 w-6 text-accent" />
                            )}
                        </div>

                        {/* Right Content Section */}
                        <div className="flex flex-1 items-center justify-between px-3.5 sm:px-4 min-w-0">
                            <div className="min-w-0 pr-2">
                                <h3 className="truncate text-xs sm:text-sm font-bold text-text-main group-hover:text-accent transition-colors">
                                    {brand.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-bg-off px-2 py-0.5 text-xs text-text-muted border border-border-subtle shrink-0">
                                        <Package className="h-3 w-3 text-accent shrink-0" />
                                        <span>{brand._count?.products ? `${brand._count.products} Items` : "In Stock"}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Right Arrow Prompt */}
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-off border border-border-subtle text-text-muted transition-colors group-hover:border-accent group-hover:bg-primary group-hover:text-accent">
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}