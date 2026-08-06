"use client";

import { useState, TouchEvent } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, CheckCircle2, ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";

export interface SpecificationItem {
    id?: string;
    label?: string;
    key?: string;
    name?: string;
    value: string;
}

export interface ClientProductProps {
    id: string;
    name: string;
    slug: string;
    status?: "ACTIVE" | "ARCHIVED";
    description?: string | null;
    shortDescription?: string | null;
    thumbnailImage?: { secureUrl: string; altText?: string | null } | null;
    images?: { secureUrl: string; altText?: string | null }[];
    variants: ProductVariant[];
    specifications?: SpecificationItem[] | Record<string, string> | null;
}

interface ProductDetailClientProps {
    product: ClientProductProps;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addToCart } = useCart();

    const rawImages: Array<{ secureUrl: string; altText?: string | null }> = [];
    if (product.thumbnailImage?.secureUrl) {
        rawImages.push(product.thumbnailImage);
    }
    if (Array.isArray(product.images)) {
        product.images.forEach((img) => {
            if (img?.secureUrl && img.secureUrl !== product.thumbnailImage?.secureUrl) {
                rawImages.push(img);
            }
        });
    }

    const images = rawImages.length > 0 ? rawImages : [{ secureUrl: "/placeholder-product.png" }];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const safeIndex = currentImageIndex % images.length;
    const currentImg = images[safeIndex] || images[0];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleTouchStart = (e: TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: TouchEvent) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 40) nextImage();
        if (diff < -40) prevImage();
        setTouchStartX(null);
    };

    const defaultVariant: ProductVariant = {
        id: `default-${product.id}`,
        name: "Standard Package",
        weightOrSize: "Standard",
        productId: product.id,
    };

    const activeVariants = product.variants.length > 0 ? product.variants : [defaultVariant];
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(activeVariants[0]);
    const [quantity, setQuantity] = useState<number>(1);
    const [added, setAdded] = useState(false);

    const normalizedSpecs: Array<{ id?: string; label: string; value: string }> = [];

    if (Array.isArray(product.specifications)) {
        product.specifications.forEach((spec) => {
            if (spec && typeof spec === "object" && spec.value) {
                const label = spec.label || spec.key || spec.name || "Spec";
                normalizedSpecs.push({
                    id: spec.id,
                    label,
                    value: String(spec.value),
                });
            }
        });
    } else if (product.specifications && typeof product.specifications === "object") {
        Object.entries(product.specifications).forEach(([k, v]) => {
            if (v) normalizedSpecs.push({ label: k, value: String(v) });
        });
    }

    const handleVariantChange = (variant: ProductVariant) => {
        setSelectedVariant(variant);
    };

    const handleAddToCart = () => {
        const fullProduct: Product = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            status: product.status || "ACTIVE",
            thumbnailImage: product.thumbnailImage || undefined,
            images: product.images || [],
            variants: product.variants,
            specifications: normalizedSpecs as unknown as Product["specifications"],
        };

        addToCart(fullProduct, selectedVariant, quantity);

        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setQuantity(1);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Scaled 1:1 Square Hero Frame (5 columns on large screens) */}
            <div className="lg:col-span-5 space-y-4">
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full aspect-square max-w-md bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 select-none shadow-xs group mx-auto"
                >
                    <Image
                        src={currentImg.secureUrl}
                        alt={currentImg.altText || product.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 450px"
                        className="object-cover transition-all duration-300"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-amber-500 text-white hover:text-slate-950 transition-all shadow-md backdrop-blur-xs cursor-pointer active:scale-90 border border-white/20"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-amber-500 text-white hover:text-slate-950 transition-all shadow-md backdrop-blur-xs cursor-pointer active:scale-90 border border-white/20"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <div className="absolute bottom-3 right-3 z-20 bg-slate-900/70 text-white text-xs tracking-tight font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                                {safeIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-md mx-auto">
                        {images.map((img, idx) => {
                            const isSelected = idx === safeIndex;
                            return (
                                <button
                                    key={`thumb-${idx}`}
                                    type="button"
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-14 h-14 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${isSelected
                                            ? "border-amber-500 ring-2 ring-amber-500/40 opacity-100 scale-105"
                                            : "border-slate-200 opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img.secureUrl}
                                        alt={img.altText || `${product.name} thumbnail ${idx + 1}`}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right Column: Controls & Specs (7 columns on large screens) */}
            <div className="lg:col-span-7 space-y-6">
                {/* Packaging Variants */}
                {product.variants.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                                Select Packaging / Variant
                            </label>
                            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {selectedVariant.weightOrSize || "Standard"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {product.variants.map((v, idx) => {
                                const isSelected = selectedVariant.id === v.id;
                                const variantKey = v.id || `variant-${idx}`;

                                return (
                                    <button
                                        key={variantKey}
                                        type="button"
                                        onClick={() => handleVariantChange(v)}
                                        className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${isSelected
                                                ? "border-amber-500 bg-amber-500/10 text-slate-900 font-bold shadow-xs ring-1 ring-amber-500"
                                                : "border-slate-200 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                                            }`}
                                    >
                                        <div className="text-xs font-bold text-slate-900 truncate">
                                            {v.name || "Default Variant"}
                                        </div>
                                        <div className="text-xs font-semibold text-amber-600 mt-0.5">
                                            {v.weightOrSize || "Standard Pack"}
                                        </div>
                                        {v.sku && (
                                            <div className="text-xs font-mono text-slate-400 mt-0.5">
                                                SKU: {v.sku}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Specs */}
                {normalizedSpecs.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center gap-2 text-slate-900">
                            <ListFilter className="w-4 h-4 text-amber-600 shrink-0" />
                            <h4 className="text-xs font-bold uppercase tracking-wider">
                                Technical Specifications
                            </h4>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1 border-t border-slate-200/60">
                            {normalizedSpecs.map((spec, idx) => (
                                <div
                                    key={`spec-${spec.label}-${idx}`}
                                    className="flex flex-col bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs"
                                >
                                    <dt className="text-xs font-medium text-slate-500 capitalize leading-tight">
                                        {spec.label}
                                    </dt>
                                    <dd className="font-semibold text-slate-900 text-xs mt-0.5">
                                        {spec.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                {/* Quantity & Add Action */}
                <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 shadow-2xs shrink-0 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer select-none"
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="px-3 py-2 text-xs font-bold text-slate-900 min-w-8 text-center select-none">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer select-none"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={added}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm cursor-pointer active:scale-98 ${added
                                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                                : "bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950"
                            }`}
                    >
                        {added ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Added {quantity} to Inquiry Cart</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add {quantity} to Inquiry</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}