"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, RotateCcw, Filter } from "lucide-react";

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
}

interface BrandOption {
    id: string;
    name: string;
    slug: string;
    _count?: { products: number };
}

interface ProductFilterSidebarProps {
    categories: CategoryOption[];
    brands: BrandOption[];
}

export default function ProductFilterSidebar({
    categories,
    brands,
}: ProductFilterSidebarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentCategory = searchParams.get("category") || "";
    const currentBrand = searchParams.get("brand") || "";
    const currentSearch = searchParams.get("search") || "";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        replace(pathname);
    };

    const hasActiveFilters = currentCategory || currentBrand || currentSearch;

    return (
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
            {/* Search Input */}
            <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search materials or SKUs..."
                    value={currentSearch}
                    onChange={(e) => updateParam("search", e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-bg-off border border-border-subtle rounded text-2xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Header with Clear Button */}
            <div className="flex items-center justify-between pt-1 border-b border-border-subtle pb-2">
                <div className="flex items-center gap-1.5 text-primary font-extrabold text-xs">
                    <Filter className="w-3.5 h-3.5 text-accent" />
                    <span>Filters</span>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-3xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* Categories Section */}
            <div className="space-y-1.5">
                <h3 className="text-3xs font-extrabold uppercase tracking-wider text-primary">
                    Categories
                </h3>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => updateParam("category", "")}
                        className={`w-full text-left px-2 py-1 rounded text-2xs flex justify-between items-center transition-colors cursor-pointer ${!currentCategory
                                ? "bg-primary text-bg-main font-bold"
                                : "text-text-muted hover:bg-bg-off hover:text-text-main"
                            }`}
                    >
                        <span>All Categories</span>
                    </button>
                    {categories.map((cat) => {
                        const isSelected = currentCategory === cat.slug;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => updateParam("category", cat.slug)}
                                className={`w-full text-left px-2 py-1 rounded text-2xs flex justify-between items-center transition-colors cursor-pointer ${isSelected
                                        ? "bg-primary text-bg-main font-bold"
                                        : "text-text-muted hover:bg-bg-off hover:text-text-main"
                                    }`}
                            >
                                <span className="truncate">{cat.name}</span>
                                {cat._count?.products !== undefined && (
                                    <span className={`text-3xs px-1 rounded ${isSelected ? "bg-bg-main/20 text-bg-main" : "bg-bg-off text-text-muted"}`}>
                                        {cat._count.products}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Brands Section */}
            <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                <h3 className="text-3xs font-extrabold uppercase tracking-wider text-primary">
                    Brands
                </h3>
                <div className="space-y-1">
                    <button
                        type="button"
                        onClick={() => updateParam("brand", "")}
                        className={`w-full text-left px-2 py-1 rounded text-2xs flex justify-between items-center transition-colors cursor-pointer ${!currentBrand
                                ? "bg-primary text-bg-main font-bold"
                                : "text-text-muted hover:bg-bg-off hover:text-text-main"
                            }`}
                    >
                        <span>All Brands</span>
                    </button>
                    {brands.map((b) => {
                        const isSelected = currentBrand === b.slug;
                        return (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => updateParam("brand", b.slug)}
                                className={`w-full text-left px-2 py-1 rounded text-2xs flex justify-between items-center transition-colors cursor-pointer ${isSelected
                                        ? "bg-primary text-bg-main font-bold"
                                        : "text-text-muted hover:bg-bg-off hover:text-text-main"
                                    }`}
                            >
                                <span className="truncate">{b.name}</span>
                                {b._count?.products !== undefined && (
                                    <span className={`text-3xs px-1 rounded ${isSelected ? "bg-bg-main/20 text-bg-main" : "bg-bg-off text-text-muted"}`}>
                                        {b._count.products}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}