"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustValueStrip from "@/components/home/TrustValueStrip";
import BrandPartnerStrip from "@/components/home/BrandPartnerStrip";
import WholesaleCtaBanner from "@/components/home/WholesaleCtaBanner";
import { Product } from "@/types/product";
import { CategoryCardData } from "@/components/category/CategoryCard";
import { BrandCardData } from "@/components/brand/BrandCard";
import {
    Sliders,
    Plus,
    LayoutGrid,
    Eye,
    EyeOff,
    MoveUp,
    MoveDown,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Edit3,
} from "lucide-react";

export type ActionType = "product" | "category" | "brand" | "products" | "contact" | "about" | "none";
export type BackgroundType = "image" | "gradient" | "solid";

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

interface StorefrontSection {
    id: string;
    type: "hero" | "trust_strip" | "search_categories" | "brand_strip" | "featured_products" | "wholesale_cta";
    title: string;
    enabled: boolean;
    columns: 2 | 3 | 4 | 6;
}

interface PreviewPayload {
    sections: StorefrontSection[];
    slides: HeroSlide[];
    products: Product[];
    categories: CategoryCardData[];
    brands: BrandCardData[];
    draftFeaturedProductIds: string[];
    draftFeaturedCategoryIds: string[];
    draftFeaturedBrandIds: string[];
    isEditMode: boolean;
}

type BridgeActionType = "MOVE_SECTION" | "TOGGLE_SECTION" | "CYCLE_GRID" | "OPEN_SLIDE_CREATE" | "OPEN_SLIDE_EDIT" | "OPEN_PICKER";

interface BridgePayload {
    index?: number;
    direction?: "up" | "down";
    sectionId?: string;
    type?: "products" | "categories" | "brands";
    slide?: HeroSlide;
}

interface OutgoingMessage {
    type: "PREVIEW_READY" | "STOREFRONT_ACTION";
    action?: BridgeActionType;
    payload?: BridgePayload;
}

interface IncomingMessageEvent extends MessageEvent {
    data: {
        type: string;
        payload: PreviewPayload;
    };
}

const getGridClassName = (cols: number, type: string): string => {
    if (type === "search_categories") {
        switch (cols) {
            case 2:
                return "grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6";
            case 3:
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5";
            case 6:
            case 4:
            default:
                return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5";
        }
    }

    switch (cols) {
        case 2:
            return "grid-cols-2 gap-4 sm:gap-5";
        case 3:
            return "grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4.5";
        case 4:
            return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
        case 6:
        default:
            return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3";
    }
};

export default function PreviewPage() {
    const [data, setData] = useState<PreviewPayload | null>(null);
    const [activeFabricatorId, setActiveFabricatorId] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    useEffect(() => {
        const handleMessage = (event: IncomingMessageEvent) => {
            if (event.data && event.data.type === "SYNC_STOREFRONT_PREVIEW") {
                setData(event.data.payload);
            }
        };

        window.addEventListener("message", handleMessage as EventListener);

        const readyMessage: OutgoingMessage = { type: "PREVIEW_READY" };
        window.parent.postMessage(readyMessage, "*");

        return () => window.removeEventListener("message", handleMessage as EventListener);
    }, []);

    const dispatchAction = (actionType: BridgeActionType, payload?: BridgePayload) => {
        const message: OutgoingMessage = {
            type: "STOREFRONT_ACTION",
            action: actionType,
            payload: payload,
        };
        window.parent.postMessage(message, "*");
    };

    const nextSlide = useCallback((count: number) => {
        if (count <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % count);
    }, []);

    const prevSlide = useCallback((count: number) => {
        if (count <= 1) return;
        setCurrentSlide((prev) => (prev - 1 + count) % count);
    }, []);

    if (!data) {
        return (
            <div className="flex h-screen items-center justify-center bg-bg-main text-text-muted text-xs">
                Connecting to Live Canvas...
            </div>
        );
    }

    const {
        sections = [],
        slides = [],
        products = [],
        categories = [],
        brands = [],
        draftFeaturedProductIds = [],
        draftFeaturedCategoryIds = [],
        draftFeaturedBrandIds = [],
        isEditMode = true,
    } = data;

    const previewProducts = products.filter((p: Product) => draftFeaturedProductIds.includes(p.id));
    const previewCategories = categories.filter((c: CategoryCardData) => draftFeaturedCategoryIds.includes(c.id));
    const previewBrands = brands.filter((b: BrandCardData) => draftFeaturedBrandIds.includes(b.id));
    const slideCount = slides.length;

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
        <>
            {/* Global scrollbar killer for the entire iframe preview window */}
            <style jsx global>{`
                html, body, * {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                *::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-8 sm:gap-10 select-none">
                {sections.map((sec: StorefrontSection, idx: number) => {
                    if (!sec.enabled && !isEditMode) return null;
                    const isFabricatorOpen = activeFabricatorId === sec.id;

                    return (
                        <div
                            key={sec.id}
                            className={`relative group rounded-2xl transition-all ${isEditMode ? "ring-1 ring-border-subtle hover:ring-2 hover:ring-accent p-1" : ""
                                } ${!sec.enabled ? "opacity-30" : ""}`}
                        >
                            {/* Section Controls */}
                            {isEditMode && (
                                <div className="absolute top-3 right-3 z-40 flex items-start gap-1.5">
                                    <div className="relative flex flex-col items-center">
                                        <button
                                            type="button"
                                            onClick={() => setActiveFabricatorId(isFabricatorOpen ? null : sec.id)}
                                            className={`w-8 h-8 rounded-full border shadow-md flex items-center justify-center transition-all cursor-pointer ${isFabricatorOpen
                                                    ? "bg-accent border-accent text-primary font-bold scale-110"
                                                    : "bg-slate-950/90 border-slate-700 text-slate-200 hover:text-accent"
                                                }`}
                                            title="Fabricator Controls"
                                        >
                                            <Sliders className="w-3.5 h-3.5" />
                                        </button>

                                        {isFabricatorOpen && (
                                            <div className="absolute top-full mt-2.5 flex items-center justify-center gap-2 animate-in fade-in zoom-in-50 duration-200">
                                                {(sec.type === "hero" || sec.type === "search_categories" || sec.type === "featured_products" || sec.type === "brand_strip") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (sec.type === "hero") {
                                                                dispatchAction("OPEN_SLIDE_CREATE");
                                                            } else if (sec.type === "search_categories") {
                                                                dispatchAction("OPEN_PICKER", { type: "categories" });
                                                            } else if (sec.type === "featured_products") {
                                                                dispatchAction("OPEN_PICKER", { type: "products" });
                                                            } else if (sec.type === "brand_strip") {
                                                                dispatchAction("OPEN_PICKER", { type: "brands" });
                                                            }
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-accent border border-accent text-primary font-bold hover:bg-accent-subtle transition-all hover:scale-110 flex items-center justify-center shadow-md cursor-pointer"
                                                        title="Add / Stage Items"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {(sec.type === "search_categories" || sec.type === "featured_products") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => dispatchAction("CYCLE_GRID", { sectionId: sec.id })}
                                                        className="w-8 h-8 rounded-full bg-slate-950/90 border border-slate-700 text-slate-200 hover:text-accent transition-all hover:scale-110 flex items-center justify-center shadow-md cursor-pointer"
                                                        title={`Cycle Grid Columns (${sec.columns} Columns)`}
                                                    >
                                                        <LayoutGrid className="w-3.5 h-3.5 text-accent" />
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => dispatchAction("TOGGLE_SECTION", { sectionId: sec.id })}
                                                    className={`w-8 h-8 rounded-full border shadow-md transition-all hover:scale-110 flex items-center justify-center cursor-pointer ${sec.enabled
                                                            ? "bg-slate-950/90 border-slate-700 text-emerald-400"
                                                            : "bg-slate-950/90 border-slate-700 text-rose-400"
                                                        }`}
                                                    title={sec.enabled ? "Hide Section" : "Show Section"}
                                                >
                                                    {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => dispatchAction("MOVE_SECTION", { index: idx, direction: "up" })}
                                        disabled={idx === 0}
                                        className="w-8 h-8 rounded-full bg-slate-950/90 border border-slate-700 text-slate-200 hover:text-accent disabled:opacity-20 cursor-pointer flex items-center justify-center shadow-md transition-transform hover:scale-105 shrink-0"
                                        title="Move Up"
                                    >
                                        <MoveUp className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => dispatchAction("MOVE_SECTION", { index: idx, direction: "down" })}
                                        disabled={idx === sections.length - 1}
                                        className="w-8 h-8 rounded-full bg-slate-950/90 border border-slate-700 text-slate-200 hover:text-accent disabled:opacity-20 cursor-pointer flex items-center justify-center shadow-md transition-transform hover:scale-105 shrink-0"
                                        title="Move Down"
                                    >
                                        <MoveDown className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* SECTION 1: HERO */}
                            {sec.type === "hero" && (
                                <section className="relative bg-slate-950 text-white overflow-hidden rounded-2xl shadow-xl select-none border border-slate-800">
                                    <div className="relative w-full h-56 sm:h-80 md:h-96 flex items-center">
                                        {slides.map((slide: HeroSlide, index: number) => {
                                            const isActive = index === currentSlide;
                                            const href = getActionHref(slide.actionType, slide.actionValue);

                                            return (
                                                <div
                                                    key={slide.id}
                                                    className={`absolute inset-0 px-4 sm:px-10 md:px-12 py-4 sm:py-8 transition-all duration-500 ease-in-out flex flex-col justify-center overflow-hidden h-full ${isActive ? "opacity-100 translate-x-0 z-10 pointer-events-auto" : "opacity-0 translate-x-8 z-0 pointer-events-none"
                                                        }`}
                                                >
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

                                                    <div className="relative z-10 max-w-xl pr-6 sm:pr-0">
                                                        {slide.badge && (
                                                            <span className="inline-block bg-accent/20 border border-accent text-accent text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest mb-1.5 sm:mb-3">
                                                                {slide.badge}
                                                            </span>
                                                        )}

                                                        <h1 className="text-base sm:text-2xl md:text-4xl font-black text-white leading-snug sm:leading-tight mb-1 sm:mb-3 line-clamp-2">
                                                            {slide.title}
                                                        </h1>

                                                        <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-lg mb-3 sm:mb-6 leading-relaxed line-clamp-2">
                                                            {slide.subtitle}
                                                        </p>

                                                        <div className="flex items-center gap-2">
                                                            {href && slide.ctaText && (
                                                                <Link
                                                                    href={href}
                                                                    className="bg-accent text-primary font-bold px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm hover:bg-white transition-all inline-flex items-center gap-1.5 sm:gap-2 shadow-md group"
                                                                >
                                                                    <span>{slide.ctaText}</span>
                                                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                                                                </Link>
                                                            )}

                                                            {/* Slide Edit Button with Icon */}
                                                            {isEditMode && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e: React.MouseEvent) => {
                                                                        e.stopPropagation();
                                                                        dispatchAction("OPEN_SLIDE_EDIT", { slide });
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-accent hover:bg-slate-800 text-xs font-bold transition-all shadow-md cursor-pointer"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5 text-accent" />
                                                                    <span>Edit Slide</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Carousel Controls */}
                                        {slideCount > 1 && (
                                            <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-20">
                                                <button
                                                    type="button"
                                                    onClick={() => prevSlide(slideCount)}
                                                    className="hidden sm:flex p-1.5 sm:p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-accent hover:text-accent transition-colors cursor-pointer"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>

                                                <div className="flex gap-1.5 px-1">
                                                    {slides.map((_: HeroSlide, i: number) => (
                                                        <button
                                                            type="button"
                                                            key={i}
                                                            onClick={() => setCurrentSlide(i)}
                                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide ? "w-4 sm:w-6 bg-accent" : "w-1.5 bg-slate-600 hover:bg-slate-400"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => nextSlide(slideCount)}
                                                    className="hidden sm:flex p-1.5 sm:p-2 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:border-accent hover:text-accent transition-colors cursor-pointer"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {sec.type === "trust_strip" && <TrustValueStrip />}
                            {sec.type === "search_categories" && (
                                <SearchAndCategories
                                    categories={previewCategories}
                                    gridClassName={getGridClassName(sec.columns, "search_categories")}
                                />
                            )}
                            {sec.type === "brand_strip" && <BrandPartnerStrip brands={previewBrands} />}
                            {sec.type === "featured_products" && (
                                <FeaturedProducts
                                    products={previewProducts}
                                    gridClassName={getGridClassName(sec.columns, "featured_products")}
                                />
                            )}
                            {sec.type === "wholesale_cta" && <WholesaleCtaBanner />}
                        </div>
                    );
                })}
            </div>
        </>
    );
}