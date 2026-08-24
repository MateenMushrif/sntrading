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
                    <Building2 className="w-5 h-5 text-accent" />
                    <h3 className="text-base sm:text-lg font-bold text-text-main tracking-tight">
                        Authorized Brands & Mill Partners
                    </h3>
                </div>
                <Link
                    href="/products"
                    className="text-xs font-bold text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                >
                    View All Products <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="group flex flex-col items-center justify-between p-4 bg-bg-main border border-border-subtle hover:border-accent hover:shadow-lg rounded-2xl transition-all duration-300 text-center"
                    >
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-bg-off border border-border-subtle flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform shrink-0">
                            {brand.logo ? (
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain p-2"
                                    sizes="64px"
                                />
                            ) : (
                                <Building2 className="w-6 h-6 text-accent" />
                            )}
                        </div>

                        <div className="w-full">
                            <h4 className="text-xs sm:text-sm font-bold text-text-main group-hover:text-accent truncate transition-colors">
                                {brand.name}
                            </h4>
                            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-text-muted">
                                <Package className="w-3 h-3 text-accent shrink-0" />
                                <span>{brand._count?.products ? `${brand._count.products} Products` : "Bulk Stock"}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}