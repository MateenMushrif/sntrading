import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";

interface BrandItem {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
}

export default function BrandPartnerStrip({ brands }: { brands: BrandItem[] }) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                        Authorized Brands & Mill Partners
                    </h3>
                </div>
                <Link
                    href="/products"
                    className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors"
                >
                    View Catalog <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {brands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs rounded-xl transition-all text-center group"
                    >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 truncate max-w-full">
                            {brand.name}
                        </span>
                        <span className="text-xs text-slate-400 font-medium mt-0.5">
                            {brand._count?.products ? `${brand._count.products} Ingredients` : "Wholesale Stock"}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}