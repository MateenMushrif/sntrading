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
    gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4",
}: SearchAndCategoriesProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-accent" />
                    <h2 className="text-sm font-bold tracking-tight text-text-main sm:text-base">
                        Featured Raw Material Categories
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted transition-colors hover:text-accent"
                >
                    View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className={`grid ${gridClassName}`}>
                {categories.map((cat) => {
                    const targetSlug = cat.slug || cat.id;

                    return (
                        <Link
                            key={cat.id}
                            href={`/categories/${targetSlug}`}
                            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-200 hover:border-accent hover:shadow-md"
                        >
                            <div>
                                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-bg-off text-accent">
                                            <div className="rounded-lg border border-border-subtle bg-bg-main p-2 shadow-xs">
                                                <Layers className="h-4 w-4 text-accent" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-border-subtle bg-bg-main/90 px-2 py-0.5 text-xs font-bold text-text-main shadow-xs backdrop-blur-md">
                                        <Package className="h-3 w-3 text-accent" />
                                        <span>{cat._count?.products ?? 0}</span>
                                    </div>
                                </div>

                                <div className="p-3 space-y-0.5">
                                    <h3 className="line-clamp-1 text-xs font-bold text-text-main transition-colors group-hover:text-accent sm:text-sm">
                                        {cat.name}
                                    </h3>
                                    {cat.description && (
                                        <p className="line-clamp-1 text-xs text-text-muted leading-normal">
                                            {cat.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 pt-0">
                                <div className="flex items-center justify-between border-t border-border-subtle pt-2 text-xs font-bold text-accent">
                                    <span>Browse</span>
                                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}