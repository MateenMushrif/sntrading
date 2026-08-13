import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types/product";

interface FeaturedProductsProps {
    products?: Product[];
    gridClassName?: string;
}

export default function FeaturedProducts({
    products = [],
    gridClassName = "grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-6",
}: FeaturedProductsProps) {
    if (!products.length) return null;

    return (
        <section className="py-6 sm:py-8">
            <div className="container mx-auto px-3 sm:px-4">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-extrabold text-primary md:text-2xl">
                        Featured Bakery Products
                    </h2>
                    <p className="mt-1 text-xs text-text-muted md:text-sm">
                        Top-selling raw materials preferred by commercial bakeries
                    </p>
                </div>

                <ProductGrid
                    products={products}
                    gridClassName={gridClassName}
                />
            </div>
        </section>
    );
}