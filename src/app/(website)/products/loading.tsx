import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";

export default function ProductsLoading() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6">
            <ProductGridSkeleton />
        </div>
    );
}