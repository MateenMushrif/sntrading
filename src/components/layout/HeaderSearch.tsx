"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, X, Tag } from "lucide-react";

interface SearchResultProduct {
    id: string;
    name: string;
    slug: string;
    category: { name: string; slug: string };
    brand: { name: string };
    thumbnailImage?: { secureUrl: string } | null;
    images?: { secureUrl: string }[];
    variants?: { weightOrSize: string }[];
}

interface SearchResultCategory {
    id: string;
    name: string;
    slug: string;
}

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{
        products: SearchResultProduct[];
        categories: SearchResultCategory[];
    }>({ products: [], categories: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search query
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults({ products: [], categories: [] });
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults({
                    products: data.products || [],
                    categories: data.categories || [],
                });
                setIsOpen(true);
                setSelectedIndex(-1);
            } catch (err) {
                console.error("Failed to fetch search suggestions", err);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle Outside Click to Close Dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalItems = results.products.length + results.categories.length;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0 && selectedIndex < results.products.length) {
                e.preventDefault();
                const p = results.products[selectedIndex];
                router.push(`/products/${p.slug}`);
                setIsOpen(false);
            } else if (query.trim()) {
                // Full catalog search submit
                e.preventDefault();
                router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        setResults({ products: [], categories: [] });
        setIsOpen(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className="relative w-full z-50">
            {/* Search Input Box - Matching your requested styling */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-gray-900 border border-gray-700 focus:border-accent text-bg-main text-xs rounded-full pl-4 pr-9 py-1.5 focus:outline-none transition-all placeholder:text-gray-400 shadow-inner"
                />

                {loading ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                ) : query ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-accent transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        aria-label="Submit search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                )}
            </form>

            {/* Premium Live Suggestion Dropdown */}
            {isOpen && (results.products.length > 0 || results.categories.length > 0) && (
                <div className="absolute top-full mt-2 left-0 w-full md:w-[125%] md:-left-[12.5%] bg-bg-main border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5">
                    {/* Gold Accent Top Line */}
                    <div className="h-1 w-full bg-accent" />

                    {/* Categories Section */}
                    {results.categories.length > 0 && (
                        <div className="p-3 bg-bg-off border-b border-border-subtle/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted mb-2 block">
                                Categories
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {results.categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center gap-1 text-2xs font-bold px-2.5 py-1 rounded-full bg-bg-main border border-border-subtle text-text-main hover:border-accent hover:text-primary shadow-sm transition-all"
                                    >
                                        <Tag className="w-2.5 h-2.5 text-accent" />
                                        <span>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products List */}
                    {results.products.length > 0 && (
                        <div className="p-2 max-h-[50vh] overflow-y-auto space-y-0.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted px-2 py-1.5 block">
                                Products
                            </span>
                            {results.products.map((p, idx) => {
                                const isSelected = selectedIndex === idx;
                                const imgSrc =
                                    p.thumbnailImage?.secureUrl ||
                                    p.images?.[0]?.secureUrl ||
                                    "/placeholder-ingredient.png";

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isSelected
                                                ? "bg-primary/5 border-l-2 border-accent text-primary"
                                                : "hover:bg-bg-off border-l-2 border-transparent text-text-main"
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-10 h-10 rounded-md border border-border-subtle bg-bg-main overflow-hidden shrink-0 shadow-sm">
                                            <Image
                                                src={imgSrc}
                                                alt={p.name}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-xs font-extrabold truncate leading-tight">
                                                    {p.name}
                                                </h4>
                                                <span className="text-[9px] shrink-0 font-extrabold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
                                                    {p.brand.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-text-muted font-medium">
                                                    {p.category.name}
                                                </span>
                                                {p.variants?.[0] && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-border-subtle"></span>
                                                        <span className="text-[10px] font-bold text-primary">
                                                            {p.variants[0].weightOrSize}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Action Bar */}
                    <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-2.5 bg-primary text-xs font-bold text-bg-main hover:bg-primary-hover transition-colors"
                    >
                        View all results for &quot;{query}&quot;
                    </Link>
                </div>
            )}
        </div>
    );
}