"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layers, ChevronRight } from "lucide-react";

export interface CategoryCardData {
    id: string;
    name: string;
    slug?: string | null;
    image: string | null;
    description?: string | null;
    _count?: {
        products: number;
    };
}

interface CategoryCardProps {
    category: CategoryCardData;
    priority?: boolean;
}

function CategoryCardComponent({
    category,
    priority = false,
}: CategoryCardProps) {
    const targetSlug = category.slug || category.id;
    const imageUrl = typeof category.image === "string" ? category.image : null;
    const productCount = category._count?.products ?? 0;

    return (
        <Link
            href={`/categories/${targetSlug}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg select-none"
        >
            {/* 1. Aspect-Locked Canvas: Scales with grid container */}
            <div className="relative aspect-16/10 w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        priority={priority}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-bg-off text-accent">
                        <Layers className="h-10 w-10 text-accent" />
                    </div>
                )}
            </div>

            {/* 2. Bottom Content Dock */}
            <div className="p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2.5">
                    <div className="min-w-0">
                        <h3 className="truncate text-xs sm:text-sm md:text-base font-black uppercase tracking-wider text-text-main transition-colors group-hover:text-accent">
                            {category.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-text-muted">
                            {productCount} Items Available
                        </p>
                    </div>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bg-off border border-border-subtle text-text-muted transition-all duration-200 group-hover:bg-badge-amber-bg group-hover:border-accent/40 group-hover:text-badge-amber">
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default memo(CategoryCardComponent);