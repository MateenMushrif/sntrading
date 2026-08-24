import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronRight, Package, ArrowUpRight } from "lucide-react";

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="group flex flex-col items-center justify-between rounded-2xl border border-border-subtle bg-bg-main p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl select-none"
                    >
                        {/* Logo Housing */}
                        <div className="relative mb-3 flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-bg-off transition-transform duration-300 group-hover:scale-105">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain p-2"
                                    sizes="64px"
                                />
                            ) : (
                                <Building2 className="h-6 w-6 text-accent" />
                            )}
                        </div>

                        <div className="w-full space-y-1">
                            <h3 className="truncate text-xs font-bold text-text-main group-hover:text-accent transition-colors sm:text-sm">
                                {brand.name}
                            </h3>
                            <div className="inline-flex items-center gap-1 rounded-full bg-bg-off px-2 py-0.5 text-xs text-text-muted border border-border-subtle">
                                <Package className="h-3 w-3 text-accent shrink-0" />
                                <span>{brand._count?.products ? `${brand._count.products} SKUs` : "Catalog"}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex w-full items-center justify-center gap-0.5 border-t border-border-subtle pt-2 text-xs font-bold text-accent">
                            <span>Browse</span>
                            <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}