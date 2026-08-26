"use client";

import Link from "next/link";
import { Tag, ChevronRight } from "lucide-react";
import CategoryCard, { CategoryCardData } from "@/components/category/CategoryCard";

interface SearchAndCategoriesProps {
    categories: CategoryCardData[];
    gridClassName?: string;
}

export default function SearchAndCategories({
    categories,
    gridClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3",
}: SearchAndCategoriesProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-accent" />
                    <h2 className="text-sm font-bold text-text-main sm:text-base tracking-tight">
                        Featured Raw Material Categories
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className={`grid ${gridClassName}`}>
                {categories.map((cat, index) => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        priority={index < 6}
                    />
                ))}
            </div>
        </section>
    );
}