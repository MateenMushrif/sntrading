"use client";

import { useState, useEffect, TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MessageSquarePlus, Check, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product, CloudinaryImage, CategoryRelation } from "@/types/product";

interface QuickViewModalProps {
    product: Product | null;
    isOpen?: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { addToCart } = useCart();
    const active = isOpen ?? Boolean(product);

    // Track previous product ID to reset state cleanly during render pass
    const [prevProductId, setPrevProductId] = useState<string | null>(null);
    const [extraDetails, setExtraDetails] = useState<Product | null>(null);
    const [loadingExtra, setLoadingExtra] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [added, setAdded] = useState(false);

    // ✅ React Pattern: Reset state during render when prop ID changes
    const currentProductId = product?.id || null;
    if (currentProductId !== prevProductId) {
        setPrevProductId(currentProductId);
        setCurrentImageIndex(0);
        setExtraDetails(null);
        setLoadingExtra(false);
    }

    // Merge basic product data with extra details when available
    const displayProduct = (extraDetails && extraDetails.id === product?.id)
        ? { ...product, ...extraDetails }
        : product;

    // On-Demand Fetch: ONLY fetch if opened and missing gallery/specs
    useEffect(() => {
        if (!product || !active) return;

        // Skip network call if specs are already loaded
        if (Array.isArray(product.specifications) && product.specifications.length > 0) {
            return;
        }

        let isMounted = true;

        // Defer loading state execution out of synchronous effect loop
        queueMicrotask(() => {
            if (isMounted) setLoadingExtra(true);
        });

        fetch(`/api/products/${product.slug || product.id}`)
            .then((res) => res.json())
            .then((fullData) => {
                if (isMounted && fullData && !fullData.error) {
                    setExtraDetails(fullData);
                }
            })
            .catch((err) => console.error("Failed fetching extra details:", err))
            .finally(() => {
                if (isMounted) setLoadingExtra(false);
            });

        return () => {
            isMounted = false;
        };
    }, [product, active]);

    // Lock body scroll when modal is active
    useEffect(() => {
        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [active]);

    if (!active || !displayProduct) return null;

    const categoryObj: CategoryRelation =
        typeof displayProduct.category === "object" && displayProduct.category !== null
            ? displayProduct.category
            : {
                id: "gen",
                name: typeof displayProduct.category === "string" ? displayProduct.category : "General",
                slug: "general",
            };

    const categoryName = categoryObj.name;

    // Build Image List
    const rawImages: CloudinaryImage[] = [];
    if (displayProduct.thumbnailImage?.secureUrl) {
        rawImages.push(displayProduct.thumbnailImage);
    }
    if (Array.isArray(displayProduct.images)) {
        displayProduct.images.forEach((img) => {
            if (img?.secureUrl && img.secureUrl !== displayProduct.thumbnailImage?.secureUrl) {
                rawImages.push(img);
            }
        });
    }

    const images = rawImages.length > 0 ? rawImages : [{ secureUrl: "/placeholder-product.png", altText: displayProduct.name }];
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

    const normalizedSpecs: Array<{ label: string; value: string }> = [];
    if (Array.isArray(displayProduct.specifications)) {
        displayProduct.specifications.forEach((spec) => {
            if (spec && typeof spec === "object" && spec.value) {
                normalizedSpecs.push({ label: spec.label || spec.value, value: String(spec.value) });
            }
        });
    }

    const handleAddToCart = () => {
        addToCart(displayProduct);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200">
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-hidden="true" />

            <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-amber-400 text-white hover:text-slate-900 transition-all shadow-md cursor-pointer backdrop-blur-md"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Left Column Image */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full md:w-1/2 aspect-square bg-slate-950 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-200 select-none overflow-hidden shrink-0 group"
                >
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                        <span className="bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                            SN Wholesale
                        </span>
                    </div>

                    <div className="relative w-full h-full">
                        <Image
                            src={currentImg.secureUrl}
                            alt={currentImg.altText || displayProduct.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-all duration-300"
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/30 hover:bg-amber-400 text-white/80 hover:text-slate-950 transition-all border border-white/10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/30 hover:bg-amber-400 text-white/80 hover:text-slate-950 transition-all border border-white/10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Right Column Details */}
                <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col justify-between bg-white">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                                {categoryName}
                            </span>
                            {loadingExtra && (
                                <span className="inline-flex items-center gap-1 text-2xs text-slate-400">
                                    <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                                    <span>Syncing...</span>
                                </span>
                            )}
                        </div>

                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                            {displayProduct.name}
                        </h2>

                        {displayProduct.shortDescription && (
                            <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                                {displayProduct.shortDescription}
                            </p>
                        )}

                        {/* Specs Section */}
                        {normalizedSpecs.length > 0 ? (
                            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                                    Specifications
                                </h4>
                                <dl className="grid grid-cols-2 gap-2 text-xs">
                                    {normalizedSpecs.slice(0, 4).map((spec, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <dt className="text-gray-500 text-xs font-medium capitalize">{spec.label}</dt>
                                            <dd className="font-semibold text-slate-900 text-xs">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ) : loadingExtra ? (
                            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200 animate-pulse space-y-2">
                                <div className="h-3 w-20 bg-slate-200 rounded" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-5 bg-slate-200 rounded" />
                                    <div className="h-5 bg-slate-200 rounded" />
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5 mt-auto">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={`flex-1 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${added ? "bg-amber-400 text-slate-900" : "bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-900"
                                }`}
                        >
                            {added ? <Check className="w-3.5 h-3.5" /> : <MessageSquarePlus className="w-3.5 h-3.5" />}
                            <span>{added ? "Added to Quote" : "Add to Inquiry"}</span>
                        </button>

                        <Link
                            href={`/products/${displayProduct.slug}`}
                            onClick={onClose}
                            className="text-xs font-bold text-slate-900 hover:text-amber-600 border border-gray-300 hover:border-amber-400 py-2.5 px-4 rounded-xl flex items-center gap-1 transition-colors"
                        >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}