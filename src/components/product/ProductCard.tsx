"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
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
            className="group flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-200 hover:border-accent hover:shadow-md select-none"
        >
            <div>
                {/* 16:9 Standard Aspect Ratio */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 pointer-events-none">
                        {brandName ? (
                            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs">
                                {brandName}
                            </span>
                        ) : (
                            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs">
                                SN Wholesale
                            </span>
                        )}
                    </div>

                    <div className="relative h-full w-full">
                        <Image
                            src={imageUrl}
                            alt={product.thumbnailImage?.altText || product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
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
                        className="absolute bottom-2 right-2 z-20 flex cursor-pointer items-center justify-center rounded-lg bg-primary p-1.5 text-accent shadow-sm transition-colors duration-150 active:scale-95 hover:bg-accent hover:text-primary"
                    >
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-2.5">
                    {categoryName && (
                        <span className="block truncate text-xs font-bold uppercase tracking-wider text-badge-amber">
                            {categoryName}
                        </span>
                    )}

                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="line-clamp-1 text-xs font-bold text-primary transition-colors group-hover:text-accent sm:text-sm"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {product.shortDescription && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">
                            {product.shortDescription}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Spec Row */}
            <div className="p-2.5 pt-0">
                <div className="flex items-center justify-between border-t border-border-subtle pt-1.5 text-xs text-text-muted">
                    {product.specifications && product.specifications.length > 0 ? (
                        <span className="truncate">
                            <strong className="text-text-main">{product.specifications[0].label}:</strong> {product.specifications[0].value}
                        </span>
                    ) : (
                        <span>Bulk Pack</span>
                    )}
                    <span className="font-bold text-accent">Details</span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);