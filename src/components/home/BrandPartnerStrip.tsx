import React from "react";
import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import BrandCard, { BrandCardData } from "@/components/brand/BrandCard";

interface BrandPartnerStripProps {
    brands: BrandCardData[];
}

export default function BrandPartnerStrip({ brands }: BrandPartnerStripProps) {
    if (!brands || brands.length === 0) return null;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent" />
                    <h2 className="text-sm font-bold text-text-main sm:text-base tracking-tight">
                        Authorized Brands & Mill Partners
                    </h2>
                </div>
                <Link
                    href="/brands"
                    className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-accent transition-colors"
                >
                    <span>All Brands</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* 2 columns on mobile, auto-flowing flex wrap on desktop */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:flex md:flex-wrap">
                {brands.map((brand, index) => (
                    <BrandCard
                        key={brand.id}
                        brand={brand}
                        priority={index < 4}
                    />
                ))}
            </div>
        </section>
    );
}