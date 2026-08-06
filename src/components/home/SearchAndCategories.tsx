"use client";

import Link from "next/link";
import Image from "next/image";
import { Layers, Package, ArrowRight } from "lucide-react";

interface CategoryWithCount {
    id: string;
    name: string;
    slug?: string;
    image: string | null;
    description?: string | null;
    _count?: {
        products: number;
    };
}

interface SearchAndCategoriesProps {
    categories: CategoryWithCount[];
}

export default function SearchAndCategories({ categories }: SearchAndCategoriesProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="py-6 sm:py-8">
            <div className="container mx-auto px-3 sm:px-4">
                {/* Standardized Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-extrabold text-primary md:text-2xl">
                        Featured Categories
                    </h2>
                    <p className="mt-1 text-xs text-text-muted md:text-sm">
                        Browse our high-quality raw ingredients catalogue
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.id}`}
                            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-bg-main transition-all hover:border-accent hover:shadow-md"
                        >
                            <div>
                                {/* Banner Box Covering Top */}
                                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                                    {cat.image ? (
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-bg-off text-text-muted transition-colors group-hover:bg-accent-subtle/20">
                                            <div className="rounded-md border border-border-subtle bg-bg-main p-1.5 shadow-xs">
                                                <Layers className="h-4 w-4 text-accent" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Count Badge */}
                                    {cat._count !== undefined && (
                                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full border border-border-subtle bg-bg-main/90 px-2 py-0.5 text-xs font-bold text-primary shadow-xs backdrop-blur-md">
                                            <Package className="h-3 w-3 text-accent" />
                                            <span>{cat._count.products}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Body */}
                                <div className="p-2.5">
                                    <h3 className="line-clamp-1 text-xs font-bold text-primary transition-colors group-hover:text-accent sm:text-sm">
                                        {cat.name}
                                    </h3>
                                    {cat.description && (
                                        <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
                                            {cat.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-2.5 pt-0">
                                <div className="flex items-center justify-between border-t border-border-subtle pt-1.5 text-xs font-bold text-accent">
                                    <span>Browse</span>
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}