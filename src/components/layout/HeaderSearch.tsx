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
    category?: { name?: string; slug?: string } | null;
    brand?: { name?: string } | null;
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

    // Derived state check: reset dropdown when query is short
    const isQueryValid = query.trim().length >= 2;
    if (!isQueryValid && (results.products.length > 0 || results.categories.length > 0 || isOpen)) {
        setResults({ products: [], categories: [] });
        setIsOpen(false);
    }

    // Debounced search fetcher
    useEffect(() => {
        if (!isQueryValid) return;

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults({
                        products: Array.isArray(data.products) ? data.products : [],
                        categories: Array.isArray(data.categories) ? data.categories : [],
                    });
                    setIsOpen(true);
                    setSelectedIndex(-1);
                }
            } catch (err) {
                console.error("Failed to fetch search suggestions:", err);
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query, isQueryValid]);

    // Close dropdown on outside click
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
                if (p?.slug) {
                    router.push(`/products/${p.slug}`);
                    setIsOpen(false);
                }
            } else if (query.trim()) {
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

    const hasResults = results.products.length > 0 || results.categories.length > 0;

    return (
        <div ref={dropdownRef} className="relative w-full z-50">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                    type="text"
                    placeholder="Search ingredients, brands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => isQueryValid && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 text-white text-xs rounded-full pl-4 pr-9 py-1.5 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                />

                {loading ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                ) : query ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        aria-label="Submit search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                )}
            </form>

            {/* Live Suggestion Dropdown */}
            {isOpen && hasResults && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-80 sm:-left-8 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5 z-50">
                    <div className="h-1 w-full bg-amber-400" />

                    {/* Categories Section */}
                    {results.categories.length > 0 && (
                        <div className="p-2.5 bg-slate-50 border-b border-slate-200">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1.5 block">
                                Categories
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {results.categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 hover:border-amber-400 hover:text-amber-600 shadow-sm transition-all"
                                    >
                                        <Tag className="w-2.5 h-2.5 text-amber-500" />
                                        <span>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Products List */}
                    {results.products.length > 0 && (
                        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 px-2 py-1 block">
                                Products
                            </span>
                            {results.products.map((p, idx) => {
                                const isSelected = selectedIndex === idx;
                                const imgSrc =
                                    p.thumbnailImage?.secureUrl ||
                                    p.images?.[0]?.secureUrl ||
                                    "/placeholder-product.png";

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isSelected
                                                ? "bg-amber-50 border-l-2 border-amber-500 text-slate-900"
                                                : "hover:bg-slate-50 border-l-2 border-transparent text-slate-800"
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-10 h-10 rounded-md border border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-sm">
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
                                                <h4 className="text-xs font-bold truncate leading-tight text-slate-900">
                                                    {p.name}
                                                </h4>
                                                {p.brand?.name && (
                                                    <span className="text-xs shrink-0 font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                                        {p.brand.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {p.category?.name && (
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        {p.category.name}
                                                    </span>
                                                )}
                                                {p.variants?.[0]?.weightOrSize && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        <span className="text-xs font-bold text-slate-700">
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
                        className="block text-center py-2.5 bg-slate-900 text-xs font-bold text-amber-400 hover:bg-slate-950 transition-colors border-t border-slate-100"
                    >
                        View all results for &quot;{query}&quot; →
                    </Link>
                </div>
            )}
        </div>
    );
}