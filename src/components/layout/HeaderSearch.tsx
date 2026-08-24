"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
}

interface SearchResultCategory {
    id: string;
    name: string;
    slug: string;
}

interface SearchData {
    products: SearchResultProduct[];
    categories: SearchResultCategory[];
}

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchData>({ products: [], categories: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsDismissed(true);
        setIsOpen(false);
    }

    const isQueryValid = query.trim().length >= 2;

    const closeSearchDropdown = useCallback(() => {
        setIsDismissed(true);
        setIsOpen(false);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

    useEffect(() => {
        const trimmed = query.trim();

        if (trimmed.length < 2) {
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data: SearchData = await res.json();
                    setResults({
                        products: Array.isArray(data.products) ? data.products : [],
                        categories: Array.isArray(data.categories) ? data.categories : [],
                    });
                    setIsOpen(true);
                    setSelectedIndex(-1);
                }
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === "AbortError") return;
                console.error("Search fetch error:", err);
            } finally {
                setLoading(false);
            }
        }, 150);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDismissed(true);
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsDismissed(false);
        if (val.trim().length < 2) {
            setResults({ products: [], categories: [] });
            setIsOpen(false);
            setLoading(false);
        }
    };

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
                    closeSearchDropdown();
                    router.push(`/products/${p.slug}`);
                }
            } else if (query.trim()) {
                e.preventDefault();
                closeSearchDropdown();
                router.push(`/products?search=${encodeURIComponent(query.trim())}`);
            }
        } else if (e.key === "Escape") {
            closeSearchDropdown();
        }
    };

    const handleClear = () => {
        setQuery("");
        setResults({ products: [], categories: [] });
        closeSearchDropdown();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            closeSearchDropdown();
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const showDropdown = isOpen && !isDismissed && (results.products.length > 0 || results.categories.length > 0);

    return (
        <div ref={dropdownRef} className="relative w-full z-50">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search ingredients, brands..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (isQueryValid) {
                            setIsDismissed(false);
                            setIsOpen(true);
                        }
                    }}
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

            {showDropdown && (
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
                                        onClick={closeSearchDropdown}
                                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:border-amber-400 hover:text-amber-600 shadow-xs transition-all"
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
                                const imgSrc = p.thumbnailImage?.secureUrl || "/placeholder-product.png";

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.slug}`}
                                        onClick={closeSearchDropdown}
                                        className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isSelected
                                                ? "bg-amber-50 border-l-2 border-amber-500 text-slate-900"
                                                : "hover:bg-slate-50 border-l-2 border-transparent text-slate-800"
                                            }`}
                                    >
                                        <div className="relative w-9 h-9 rounded-md border border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-xs">
                                            <Image
                                                src={imgSrc}
                                                alt={p.name}
                                                fill
                                                sizes="36px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-start justify-between gap-1">
                                                <h4 className="text-xs font-bold truncate leading-tight text-slate-900">
                                                    {p.name}
                                                </h4>
                                                {p.brand?.name && (
                                                    <span className="text-xs shrink-0 font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                                        {p.brand.name}
                                                    </span>
                                                )}
                                            </div>
                                            {p.category?.name && (
                                                <span className="text-xs text-slate-500 font-medium block truncate mt-0.5">
                                                    {p.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={closeSearchDropdown}
                        className="block text-center py-2.5 bg-slate-900 text-xs font-bold text-amber-400 hover:bg-slate-950 transition-colors border-t border-slate-100"
                    >
                        View all results for &quot;{query}&quot; →
                    </Link>
                </div>
            )}
        </div>
    );
}