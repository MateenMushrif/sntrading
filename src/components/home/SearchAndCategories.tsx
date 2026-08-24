"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag, ChevronRight, Layers, Package, ArrowRight } from "lucide-react";

interface CategoryWithCount {
    id: string;
    name: string;
    slug?: string | null;
    image: string | null;
    description?: string | null;
    _count?: {
        products: number;
    };
}

interface SearchAndCategoriesProps {
    categories: CategoryWithCount[];
    gridClassName?: string;
}

export default function SearchAndCategories({
    categories,
    gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
}: SearchAndCategoriesProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-accent" />
                    <h2 className="text-base font-bold text-text-main sm:text-lg tracking-tight">
                        Featured Raw Material Categories
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    View All Categories <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            <div className={`grid ${gridClassName}`}>
                {categories.map((cat) => {
                    const targetSlug = cat.slug || cat.id;

                    return (
                        <Link
                            key={cat.id}
                            href={`/categories/${targetSlug}`}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl select-none"
                        >
                            <div>
                                {/* Category Media Canvas */}
                                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-bg-off text-accent">
                                            <div className="rounded-xl border border-border-subtle bg-bg-main p-3 shadow-xs">
                                                <Layers className="h-6 w-6 text-accent" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Item Inventory Badge */}
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-main/90 px-2.5 py-0.5 text-xs font-bold text-text-main shadow-xs backdrop-blur-md">
                                        <Package className="h-3.5 w-3.5 text-accent" />
                                        <span>{cat._count?.products ?? 0} Items</span>
                                    </div>
                                </div>

                                {/* Body Information */}
                                <div className="p-4 space-y-1">
                                    <h3 className="line-clamp-1 text-sm font-bold text-text-main transition-colors group-hover:text-accent sm:text-base">
                                        {cat.name}
                                    </h3>
                                    {cat.description ? (
                                        <p className="line-clamp-2 text-xs text-text-muted leading-relaxed">
                                            {cat.description}
                                        </p>
                                    ) : (
                                        <p className="line-clamp-1 text-xs text-text-muted italic">
                                            Commercial grade wholesale ingredients catalog.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Browse Footer */}
                            <div className="p-4 pt-0">
                                <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs font-bold text-accent">
                                    <span>Explore Range</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}