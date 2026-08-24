import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronRight, Package } from "lucide-react";

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
                    <h3 className="text-base font-bold tracking-tight text-text-main sm:text-lg">
                        Authorized Brands & Mill Partners
                    </h3>
                </div>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted transition-colors hover:text-accent"
                >
                    View All Products <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="group flex flex-col items-center justify-between rounded-xl border border-border-subtle bg-bg-main p-3 text-center shadow-xs transition-all duration-200 hover:border-accent hover:shadow-md"
                    >
                        <div className="relative mb-2 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-bg-off transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain p-1.5"
                                    sizes="56px"
                                />
                            ) : (
                                <Building2 className="h-5 w-5 text-accent" />
                            )}
                        </div>

                        <div className="w-full">
                            <h4 className="truncate text-xs font-bold text-text-main transition-colors group-hover:text-accent sm:text-sm">
                                {brand.name}
                            </h4>
                            <div className="mt-0.5 flex items-center justify-center gap-1 text-xs text-text-muted">
                                <Package className="h-3 w-3 text-accent shrink-0" />
                                <span>{brand._count?.products ? `${brand._count.products} Products` : "Bulk Stock"}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}