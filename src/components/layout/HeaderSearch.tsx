"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Tag } from "lucide-react";

interface SearchProduct {
    id: string;
    name: string;
    slug: string;
    category?: { name: string; slug: string } | null;
    brand?: { name: string } | null;
    thumbnailImage?: { secureUrl: string } | null;
}

interface SearchCategory {
    id: string;
    name: string;
    slug: string;
}

interface CatalogIndex {
    products: SearchProduct[];
    categories: SearchCategory[];
}

let globalCatalog: CatalogIndex | null = null;
let catalogPromise: Promise<CatalogIndex> | null = null;

function loadCatalogIndex(): Promise<CatalogIndex> {
    if (globalCatalog) return Promise.resolve(globalCatalog);
    if (catalogPromise) return catalogPromise;

    catalogPromise = fetch("/api/search/catalog-index")
        .then((res) => (res.ok ? res.json() : { products: [], categories: [] }))
        .then((data: CatalogIndex) => {
            globalCatalog = {
                products: Array.isArray(data.products) ? data.products : [],
                categories: Array.isArray(data.categories) ? data.categories : [],
            };
            return globalCatalog;
        })
        .catch(() => {
            globalCatalog = { products: [], categories: [] };
            return globalCatalog;
        });

    return catalogPromise;
}

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [catalog, setCatalog] = useState<CatalogIndex | null>(globalCatalog);
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsDismissed(true);
        setIsOpen(false);
    }

    useEffect(() => {
        if (!globalCatalog) {
            loadCatalogIndex().then((data) => setCatalog(data));
        }
    }, []);

    const isQueryValid = query.trim().length >= 2;

    const filteredResults = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed || trimmed.length < 2 || !catalog) {
            return { products: [], categories: [] };
        }

        const matchedCategories = catalog.categories
            .filter((c) => c.name.toLowerCase().includes(trimmed) || c.slug.toLowerCase().includes(trimmed))
            .slice(0, 3);

        const matchedProducts = catalog.products
            .filter((p) => {
                return (
                    p.name.toLowerCase().includes(trimmed) ||
                    p.category?.name.toLowerCase().includes(trimmed) ||
                    p.brand?.name.toLowerCase().includes(trimmed)
                );
            })
            .slice(0, 6);

        return { products: matchedProducts, categories: matchedCategories };
    }, [query, catalog]);

    const closeSearchDropdown = useCallback(() => {
        setIsDismissed(true);
        setIsOpen(false);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);

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
        setQuery(e.target.value);
        setIsDismissed(false);
        setIsOpen(true);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const totalItems = filteredResults.products.length + filteredResults.categories.length;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0 && selectedIndex < filteredResults.products.length) {
                e.preventDefault();
                const p = filteredResults.products[selectedIndex];
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
        closeSearchDropdown();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            closeSearchDropdown();
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const showDropdown = isOpen && !isDismissed && isQueryValid && (filteredResults.products.length > 0 || filteredResults.categories.length > 0);

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
                    className="w-full bg-slate-900 border border-slate-700 focus:border-accent text-white text-xs rounded-full pl-4 pr-9 py-1.5 focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                />

                {query ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-accent transition-colors cursor-pointer"
                    >
                        <X className="w-3 h-3" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        aria-label="Submit search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors cursor-pointer"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                )}
            </form>

            {showDropdown && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-80 sm:-left-8 bg-bg-main border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col z-50">
                    {/* Categories */}
                    {filteredResults.categories.length > 0 && (
                        <div className="p-2.5 bg-bg-off border-b border-border-subtle">
                            <span className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 block">
                                Categories
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {filteredResults.categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${cat.slug}`}
                                        onClick={closeSearchDropdown}
                                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-bg-main border border-border-subtle text-text-main hover:border-accent hover:text-accent shadow-xs transition-all"
                                    >
                                        <Tag className="w-2.5 h-2.5 text-accent" />
                                        <span>{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Product Suggestions */}
                    {filteredResults.products.length > 0 && (
                        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-text-muted px-2 py-1 block">
                                Products
                            </span>
                            {filteredResults.products.map((p, idx) => {
                                const isSelected = selectedIndex === idx;
                                const imgSrc = p.thumbnailImage?.secureUrl || "/placeholder-product.png";

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.slug}`}
                                        onClick={closeSearchDropdown}
                                        className={`flex items-start gap-3 p-2 rounded-lg transition-all ${isSelected
                                                ? "bg-accent-subtle border-l-2 border-accent text-text-main"
                                                : "hover:bg-bg-off border-l-2 border-transparent text-text-main"
                                            }`}
                                    >
                                        <div className="relative w-9 h-9 rounded-md border border-border-subtle bg-bg-off overflow-hidden shrink-0 shadow-xs">
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
                                                <h4 className="text-xs font-bold truncate leading-tight text-text-main">
                                                    {p.name}
                                                </h4>
                                                {p.brand?.name && (
                                                    <span className="text-xs shrink-0 font-bold uppercase tracking-wider text-badge-amber bg-badge-amber-bg px-1.5 py-0.5 rounded border border-badge-amber/20">
                                                        {p.brand.name}
                                                    </span>
                                                )}
                                            </div>
                                            {p.category?.name && (
                                                <span className="text-xs text-text-muted font-medium block truncate mt-0.5">
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
                        className="block text-center py-2.5 bg-primary text-xs font-bold text-accent hover:bg-primary-hover transition-colors border-t border-border-subtle"
                    >
                        View all results for &quot;{query}&quot; →
                    </Link>
                </div>
            )}
        </div>
    );
}