"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquarePlus, ArrowUpRight, Sparkles } from "lucide-react";
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
            className="group relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl select-none"
        >
            <div>
                {/* Media Showcase Frame */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg-off">
                    {/* Top Floating Info Tags */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                        {categoryName ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-main/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-badge-amber shadow-xs backdrop-blur-md truncate max-w-xs">
                                <Sparkles className="h-3 w-3 text-accent shrink-0" />
                                <span>{categoryName}</span>
                            </span>
                        ) : <span />}

                        {brandName ? (
                            <span className="rounded-md bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs shrink-0">
                                {brandName}
                            </span>
                        ) : (
                            <span className="rounded-md bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent shadow-xs shrink-0">
                                Direct Supply
                            </span>
                        )}
                    </div>

                    {/* Product Media */}
                    <div className="relative h-full w-full">
                        <Image
                            src={imageUrl}
                            alt={product.thumbnailImage?.altText || product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    </div>

                    {/* Interactive Add to Quote Action */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        title="Add to Quote Request"
                        aria-label="Add to Quote Request"
                        className="absolute bottom-2.5 right-2.5 z-20 flex cursor-pointer items-center justify-center rounded-xl bg-primary p-2.5 text-accent shadow-md transition-all duration-200 active:scale-90 hover:bg-accent hover:text-primary"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                    </button>
                </div>

                {/* Card Editorial Body */}
                <div className="p-4 space-y-1.5">
                    <Link
                        href={`/products/${product.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="line-clamp-1 text-sm font-bold text-text-main transition-colors group-hover:text-accent sm:text-base leading-snug block"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {product.shortDescription ? (
                        <p className="line-clamp-2 text-xs text-text-muted leading-relaxed">
                            {product.shortDescription}
                        </p>
                    ) : (
                        <p className="line-clamp-1 text-xs text-text-muted italic">
                            Factory packaged bulk ingredient for commercial bakeries.
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Meta & Details Row */}
            <div className="p-4 pt-0">
                <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
                    {product.specifications && product.specifications.length > 0 ? (
                        <span className="truncate text-text-muted max-w-xs">
                            <span className="font-semibold text-text-main">{product.specifications[0].label}:</span> {product.specifications[0].value}
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-md bg-accent-subtle/50 px-2 py-0.5 font-bold text-primary">
                            Bulk Stock
                        </span>
                    )}

                    <span className="flex items-center gap-1 font-bold text-accent transition-transform duration-200 group-hover:translate-x-1 shrink-0">
                        Details <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCardComponent);