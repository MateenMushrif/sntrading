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
    gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4",
}: FeaturedProductsProps) {
    if (!products.length) return null;

    return (
        <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
                    <h2 className="text-sm font-bold text-text-main sm:text-lg tracking-tight">
                        Featured Bakery Materials
                    </h2>
                </div>

                <Link
                    href="/products"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    View All Products <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <ProductGrid
                products={products}
                gridClassName={gridClassName}
            />
        </section>
    );
}