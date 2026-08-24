"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquarePlus, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

function ProductCardComponent({ product, onQuickView }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onQuickView(product);
    };

    const imageUrl =
        product.thumbnailImage?.secureUrl ||
        product.images?.[0]?.secureUrl ||
        "/placeholder-product.png";

    const categoryName =
        typeof product.category === "object" && product.category !== null
            ? product.category.name
            : typeof product.category === "string"
                ? product.category
                : "";

    const brandName =
        typeof product.brand === "object" && product.brand !== null
            ? product.brand.name
            : "";

    return (
        <div
            onClick={handleCardClick}
            className="group flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-300 hover:border-accent hover:shadow-xl select-none"
        >
            <div>
                {/* Proportional 16:9 Image */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                        {categoryName ? (
                            <span className="rounded-md bg-bg-main/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-badge-amber border border-border-subtle shadow-xs backdrop-blur-md">
                                {categoryName}
                            </span>
                        ) : <span />}

                        {brandName ? (
                            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs">
                                {brandName}
                            </span>
                        ) : (
                            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs">
                                Wholesale
                            </span>
                        )}
                    </div>

                    <div className="relative h-full w-full">
                        <Image
                            src={imageUrl}
                            alt={product.thumbnailImage?.altText || product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        title="Add to Quote Request"
                        aria-label="Add to Quote Request"
                        className="absolute bottom-2.5 right-2.5 z-20 flex cursor-pointer items-center justify-center rounded-xl bg-primary p-2 text-accent shadow-md transition-all duration-200 active:scale-90 hover:bg-accent hover:text-primary"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-1.5">
                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="line-clamp-1 text-sm font-bold text-text-main transition-colors group-hover:text-accent sm:text-base leading-snug block"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {product.shortDescription && (
                        <p className="line-clamp-2 text-xs text-text-muted leading-relaxed">
                            {product.shortDescription}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Spec & Action Bar */}
            <div className="p-4 pt-0">
                <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
                    {product.specifications && product.specifications.length > 0 ? (
                        <span className="truncate text-text-muted">
                            <strong className="text-text-main font-semibold">{product.specifications[0].label}:</strong> {product.specifications[0].value}
                        </span>
                    ) : (
                        <span className="text-text-muted">Bulk Industrial Pack</span>
                    )}

                    <span className="flex items-center gap-0.5 font-bold text-accent group-hover:translate-x-0.5 transition-transform shrink-0">
                        View Spec <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);