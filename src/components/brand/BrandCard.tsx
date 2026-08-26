"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, ArrowUpRight } from "lucide-react";

export interface BrandCardData {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    _count?: { products: number };
}

interface BrandCardProps {
    brand: BrandCardData;
    priority?: boolean;
}

function BrandCardEmbossed({ brand, priority = false }: BrandCardProps) {
    const productCount = brand._count?.products ?? 0;

    return (
        <Link
            href={`/products?brand=${brand.slug}`}
            className="group relative flex h-20 sm:h-24 w-full md:w-72 items-center justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-main p-2.5 sm:p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md select-none md:shrink-0"
        >
            {/* Left Logo Emblem */}
            <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:rounded-xl border border-border-subtle bg-bg-off p-1.5 sm:p-2 transition-colors duration-200 group-hover:border-accent/40 group-hover:bg-bg-main">
                {brand.logo ? (
                    <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        priority={priority}
                        className="object-contain p-1 sm:p-2 transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 640px) 48px, 64px"
                    />
                ) : (
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                )}
            </div>

            {/* Middle Content */}
            <div className="flex-1 min-w-0 px-2 sm:px-3">
                <h3 className="truncate text-xs sm:text-sm font-black uppercase tracking-wider text-text-main transition-colors duration-200 group-hover:text-accent">
                    {brand.name}
                </h3>
                <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5">
                    <span className="rounded-md bg-badge-amber-bg px-1.5 sm:px-2 py-0.5 text-xs font-bold text-badge-amber border border-accent/20">
                        {productCount} SKUs
                    </span>
                </div>
            </div>

            {/* Right Diagonal Action Arrow */}
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-bg-off text-text-muted transition-all duration-200 group-hover:bg-primary group-hover:text-accent">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
        </Link>
    );
}

export default memo(BrandCardEmbossed);