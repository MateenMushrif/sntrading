import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types/product";
import { Sparkles, ChevronRight } from "lucide-react";

interface FeaturedProductsProps {
    products?: Product[];
    gridClassName?: string;
}

export default function FeaturedProducts({
    products = [],
    gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3",
}: FeaturedProductsProps) {
    if (!products.length) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h2 className="text-sm font-bold text-text-main sm:text-base tracking-tight">
                        Featured Bakery Materials
                    </h2>
                </div>

                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <ProductGrid
                products={products}
                gridClassName={gridClassName}
            />
        </section>
    );
}