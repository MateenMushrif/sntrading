"use client";

import { useState, useEffect, TouchEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MessageSquarePlus, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product, CloudinaryImage, CategoryRelation } from "@/types/product";

interface QuickViewModalProps {
    product: Product | null;
    isOpen?: boolean;
    onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [added, setAdded] = useState(false);

    const active = isOpen ?? Boolean(product);

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

    if (!active || !product) {
        return null;
    }

    const categoryObj: CategoryRelation =
        typeof product.category === "object" && product.category !== null
            ? product.category
            : {
                id: "gen",
                name: typeof product.category === "string" ? product.category : "General",
                slug: "general",
            };

    const categoryName = categoryObj.name;

    // Deduplicate thumbnail and gallery images cleanly
    const rawImages: CloudinaryImage[] = [];
    if (product.thumbnailImage?.secureUrl) {
        rawImages.push(product.thumbnailImage);
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach((img) => {
            if (img?.secureUrl && img.secureUrl !== product.thumbnailImage?.secureUrl) {
                rawImages.push(img);
            }
        });
    }

    const images =
        rawImages.length > 0
            ? rawImages
            : [{ secureUrl: "/placeholder-ingredient.png", altText: product.name }];

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

    // Normalize specifications into uniform [{ label, value }] array
    const normalizedSpecs: Array<{ label: string; value: string }> = [];

    if (Array.isArray(product.specifications)) {
        product.specifications.forEach((spec) => {
            if (spec && typeof spec === "object" && spec.value) {
                const label = spec.label || spec.value;
                normalizedSpecs.push({ label, value: String(spec.value) });
            }
        });
    }

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            key={product.id}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-hidden="true" />

            {/* Main Modal Box */}
            <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-amber-400 text-white hover:text-slate-900 transition-all shadow-md cursor-pointer backdrop-blur-md"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* LEFT COLUMN: 1:1 Aspect Ratio Gallery */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative w-full md:w-1/2 aspect-square bg-slate-950 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-200 select-none overflow-hidden shrink-0 group"
                >
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
                        <span className="bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                            SN Wholesale
                        </span>
                    </div>

                    {/* Active Image (Strict 1:1 Fit) */}
                    <div className="relative w-full h-full">
                        <Image
                            src={currentImg.secureUrl}
                            alt={currentImg.altText || product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-all duration-300"
                        />
                    </div>

                    {/* Left/Right Glass Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/30 hover:bg-amber-400 text-white/80 hover:text-slate-950 transition-all shadow-md backdrop-blur-xs cursor-pointer active:scale-90 border border-white/10 hover:border-amber-400 opacity-70 hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/30 hover:bg-amber-400 text-white/80 hover:text-slate-950 transition-all shadow-md backdrop-blur-xs cursor-pointer active:scale-90 border border-white/10 hover:border-amber-400 opacity-70 hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === safeIndex
                                            ? "bg-amber-400 w-4"
                                            : "bg-white/40 hover:bg-white/80 w-1.5"
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT COLUMN: Details */}
                <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col justify-between overflow-y-auto bg-white">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-0.5">
                            {categoryName}
                        </span>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 leading-snug">
                            {product.name}
                        </h2>
                        {product.shortDescription || product.fullDescription ? (
                            <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                                {product.shortDescription || product.fullDescription}
                            </p>
                        ) : null}

                        {normalizedSpecs.length > 0 && (
                            <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                                    Specifications
                                </h4>
                                <dl className="grid grid-cols-2 gap-2 text-xs">
                                    {normalizedSpecs.slice(0, 4).map((spec, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <dt className="text-gray-500 text-xs font-medium capitalize">
                                                {spec.label}
                                            </dt>
                                            <dd className="font-semibold text-slate-900 text-xs">
                                                {spec.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2.5 mt-auto">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className={`flex-1 w-full font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer ${added
                                ? "bg-amber-400 text-slate-900"
                                : "bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-900"
                                }`}
                        >
                            {added ? <Check className="w-3.5 h-3.5" /> : <MessageSquarePlus className="w-3.5 h-3.5" />}
                            <span>{added ? "Added to Quote" : "Add to Inquiry"}</span>
                        </button>

                        <Link
                            href={`/products/${product.slug}`}
                            onClick={onClose}
                            className="w-full sm:w-auto text-center text-xs font-bold text-slate-900 hover:text-amber-600 border border-gray-300 hover:border-amber-400 py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors"
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