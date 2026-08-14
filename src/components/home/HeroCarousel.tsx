"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type ActionType = "product" | "category" | "brand" | "products" | "contact" | "about" | "none";
export type BackgroundType = "image" | "gradient" | "solid";
export type CarouselMode = "automatic" | "manual" | "mixed";

export interface HeroSlide {
    id: number | string;
    badge?: string;
    title: string;
    subtitle: string;
    ctaText?: string;
    actionType: ActionType;
    actionValue?: string;
    bgType: BackgroundType;
    bgValue?: string;
}

interface HeroCarouselProps {
    slides?: HeroSlide[];
    mode?: CarouselMode;
    autoPlayInterval?: number;
}

const defaultSlides: HeroSlide[] = [
    {
        id: "slide_1",
        badge: "SN Trading Exclusive",
        title: "Premium Wholesale Bakery Ingredients",
        subtitle: "Direct B2B supply of chocolate, cocoa powders, and essential baking raw materials.",
        ctaText: "Browse Catalogue",
        actionType: "products",
        bgType: "gradient",
        bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #78350f 100%)",
    },
    {
        id: "slide_2",
        badge: "Industrial Supply",
        title: "Bulk Margarine, Fats & Emulsifiers",
        subtitle: "High-performance fats formulated for commercial bakeries and confectionery success.",
        ctaText: "Explore Fats & Oils",
        actionType: "category",
        actionValue: "fats-margarine",
        bgType: "gradient",
        bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e3a8a 100%)",
    },
    {
        id: "slide_3",
        badge: "Certified Quality",
        title: "Signature Flavors & Food Colors",
        subtitle: "Concentrated flavoring agents and vibrant food dyes for professional creation.",
        ctaText: "View Categories",
        actionType: "category",
        actionValue: "flavors-emulsions",
        bgType: "gradient",
        bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #064e3b 100%)",
    },
];

export default function HeroCarousel({
    slides = defaultSlides,
    mode = "mixed",
    autoPlayInterval = 4000,
}: HeroCarouselProps) {
    const activeSlides = slides.length > 0 ? slides : defaultSlides;
    const slideCount = activeSlides.length;

    const [currentSlide, setCurrentSlide] = useState(0);
    const [prevSlidesLength, setPrevSlidesLength] = useState(slides.length);
    const [isHovered, setIsHovered] = useState(false);

    if (slides.length !== prevSlidesLength) {
        setPrevSlidesLength(slides.length);
        setCurrentSlide(0);
    }

    const startX = useRef<number | null>(null);
    const isDragging = useRef<boolean>(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, [slideCount]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
    }, [slideCount]);

    const goToSlide = useCallback((index: number) => {
        setCurrentSlide(index);
    }, []);

    useEffect(() => {
        const isAutoPlayDisabled = mode === "manual" || (mode === "mixed" && isHovered);
        if (isAutoPlayDisabled) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideCount);
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [mode, isHovered, slideCount, autoPlayInterval]);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX.current === null) return;
        const diffX = startX.current - e.changedTouches[0].clientX;
        const threshold = 40;
        if (diffX > threshold) {
            nextSlide();
        } else if (diffX < -threshold) {
            prevSlide();
        }
        startX.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        startX.current = e.clientX;
        isDragging.current = true;
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging.current || startX.current === null) return;
        const diffX = startX.current - e.clientX;
        const threshold = 40;
        if (diffX > threshold) {
            nextSlide();
        } else if (diffX < -threshold) {
            prevSlide();
        }
        startX.current = null;
        isDragging.current = false;
    };

    const getActionHref = (type: ActionType, value?: string): string | null => {
        switch (type) {
            case "product":
                return value ? `/products/${value}` : "/products";
            case "category":
                return value ? `/categories/${value}` : "/categories";
            case "brand":
                return value ? `/brands/${value}` : "/brands";
            case "products":
                return "/products";
            case "contact":
                return "/contact";
            case "about":
                return "/about";
            case "none":
            default:
                return null;
        }
    };

    return (
        <section
            className="relative bg-slate-950 text-white overflow-hidden rounded-2xl shadow-xl my-4 select-none touch-pan-y cursor-grab active:cursor-grabbing border border-slate-800"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                isDragging.current = false;
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="relative w-full h-72 sm:h-96 md:h-100 flex items-center">
                {activeSlides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    const href = getActionHref(slide.actionType, slide.actionValue);

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 px-6 sm:px-12 py-8 transition-all duration-500 ease-in-out flex flex-col justify-center overflow-hidden h-full ${isActive
                                    ? "opacity-100 translate-x-0 z-10 pointer-events-auto"
                                    : "opacity-0 translate-x-8 z-0 pointer-events-none"
                                }`}
                        >
                            {/* Background Rendering Logic */}
                            {slide.bgType === "image" && slide.bgValue && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center -z-10 transition-transform duration-700 scale-105"
                                    style={{ backgroundImage: `url(${slide.bgValue})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
                                </div>
                            )}

                            {slide.bgType === "gradient" && (
                                <div
                                    className="absolute inset-0 -z-10"
                                    style={{
                                        background: slide.bgValue || "linear-gradient(135deg, #020617 0%, #0f172a 40%, #78350f 100%)",
                                    }}
                                />
                            )}

                            {slide.bgType === "solid" && (
                                <div
                                    className="absolute inset-0 -z-10"
                                    style={{
                                        backgroundColor: slide.bgValue || "#0f172a",
                                    }}
                                />
                            )}

                            <div className="relative z-10 max-w-xl pr-12 sm:pr-0">
                                {slide.badge && (
                                    <span className="inline-block bg-amber-400/20 border border-amber-400 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                                        {slide.badge}
                                    </span>
                                )}

                                <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-3 line-clamp-2">
                                    {slide.title}
                                </h1>

                                <p className="text-xs sm:text-base text-slate-300 max-w-lg mb-6 leading-relaxed line-clamp-2">
                                    {slide.subtitle}
                                </p>

                                {href && slide.ctaText && (
                                    <Link
                                        href={href}
                                        onClick={(e) => {
                                            if (isDragging.current) e.preventDefault();
                                        }}
                                        className="bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm hover:bg-white transition-all inline-flex items-center gap-2 shadow-md group"
                                    >
                                        <span>{slide.ctaText}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Navigation Controls Overlay */}
                {activeSlides.length > 1 && (
                    <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                            className="hidden sm:flex p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-amber-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex gap-1.5 px-1">
                            {activeSlides.map((_, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide
                                            ? "w-6 bg-amber-400"
                                            : "w-1.5 bg-slate-600 hover:bg-slate-400"
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next Slide"
                            className="hidden sm:flex p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-amber-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}