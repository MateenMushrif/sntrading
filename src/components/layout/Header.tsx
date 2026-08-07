"use client";

import Link from "next/link";
import {
    ShoppingBag,
    ChevronDown,
    Menu,
    X,
    Package,
    Layers,
    ShieldCheck,
    Phone,
    Mail,
    Download,
    MapPin,
} from "lucide-react";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useCart } from "@/context/CartContext";
import HeaderSearch from "@/components/layout/HeaderSearch";

interface CategoryNavItem {
    id: string;
    name: string;
    slug: string;
}

const emptySubscribe = () => () => { };
function useIsHydrated() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function Header() {
    const { totalItems } = useCart();
    const isHydrated = useIsHydrated();
    const [categories, setCategories] = useState<CategoryNavItem[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            try {
                const res = await fetch("/api/categories");
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Failed to load header categories:", err);
            }
        }

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="bg-primary text-bg-main sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
                <div className="flex items-center justify-between h-16 gap-3 md:gap-4">

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle navigation menu"
                        className="lg:hidden p-1.5 text-bg-main hover:text-accent rounded-md hover:bg-primary-hover transition-colors"
                    >
                        <Menu className="w-6 h-6 text-bg-main hover:text-accent" />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="font-bold text-lg sm:text-xl tracking-wide text-bg-main shrink-0"
                    >
                        SN TRADING
                    </Link>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3 md:gap-5 ml-auto">
                        <nav className="hidden lg:flex items-center gap-5 text-xs md:text-sm font-semibold">
                            <Link
                                href="/products"
                                className="text-bg-main/80 hover:text-accent transition-colors whitespace-nowrap"
                            >
                                All Products
                            </Link>

                            <div className="relative group py-2">
                                <Link
                                    href="/categories"
                                    className="text-bg-main/80 hover:text-accent transition-colors flex items-center gap-1 whitespace-nowrap"
                                >
                                    <span>Categories</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-accent" />
                                </Link>

                                <div className="absolute top-full right-0 w-48 bg-primary border border-border-subtle/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2 overflow-hidden">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/categories/${cat.slug}`}
                                                className="block px-4 py-1.5 text-xs text-bg-main/80 hover:bg-primary-hover hover:text-accent transition-colors truncate"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-1.5 text-xs text-bg-main/50">
                                            Loading...
                                        </div>
                                    )}

                                    <div className="my-1 border-t border-border-subtle/20" />

                                    <Link
                                        href="/categories"
                                        className="block px-4 py-1.5 text-xs font-bold text-accent hover:underline whitespace-nowrap"
                                    >
                                        View All →
                                    </Link>
                                </div>
                            </div>

                            <Link
                                href="/brands"
                                className="text-bg-main/80 hover:text-accent transition-colors whitespace-nowrap"
                            >
                                Brands
                            </Link>
                        </nav>

                        <div className="hidden sm:block w-48 md:w-64">
                            <HeaderSearch />
                        </div>

                        <Link
                            href="/cart"
                            onClick={closeMobileMenu}
                            className="bg-primary-hover border border-accent/40 hover:border-accent text-bg-main px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shrink-0"
                        >
                            <div className="relative">
                                <ShoppingBag className="w-4 h-4 text-accent" />
                                {isHydrated && totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary font-black text-xs w-4 h-4 rounded-full flex items-center justify-center border border-primary">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline">Inquiry Cart</span>
                        </Link>
                    </div>
                </div>

                <div className="sm:hidden pb-2.5 pt-1">
                    <HeaderSearch />
                </div>
            </div>

            <div className="w-full h-px bg-accent" />

            {/* LEFT-SIDE DRAWER WITH 40% FOOTER SECTION */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    onClick={closeMobileMenu}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
                />

                <aside
                    className={`absolute top-0 left-0 h-full w-72 sm:w-80 bg-primary border-r border-accent/30 shadow-2xl flex flex-col transition-transform duration-300 ease-out z-10 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-4 h-16 border-b border-border-subtle/20 shrink-0">
                        <Link
                            href="/"
                            onClick={closeMobileMenu}
                            className="font-bold text-lg tracking-wide text-bg-main"
                        >
                            SN TRADING
                        </Link>
                        <button
                            type="button"
                            onClick={closeMobileMenu}
                            className="p-1.5 rounded-lg text-bg-main/70 hover:text-accent hover:bg-primary-hover transition-colors cursor-pointer"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Top Section: Navigation Links */}
                    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-accent px-1">
                            Main Menu
                        </div>

                        <nav className="flex flex-col gap-1 text-sm font-semibold">
                            <Link
                                href="/products"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-hover text-bg-main hover:text-accent transition-colors"
                            >
                                <Package className="w-4 h-4 text-accent shrink-0" />
                                <span>All Products</span>
                            </Link>

                            <Link
                                href="/categories"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-hover text-bg-main hover:text-accent transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-4 h-4 text-accent shrink-0" />
                                    <span>Categories</span>
                                </div>
                            </Link>

                            {categories.length > 0 && (
                                <div className="ml-7 pl-3 flex flex-col gap-1 border-l border-accent/20 my-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/categories/${cat.slug}`}
                                            onClick={closeMobileMenu}
                                            className="text-xs text-bg-main/70 hover:text-accent transition-colors py-1 truncate"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <Link
                                href="/brands"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-hover text-bg-main hover:text-accent transition-colors"
                            >
                                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                                <span>Brands</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Bottom 40% Section: Footer Details */}
                    <div className="border-t border-accent/30 bg-primary-hover/60 p-4 space-y-3 shrink-0">
                        <div className="text-xs font-bold uppercase tracking-wider text-accent">
                            Quick Contact & Info
                        </div>

                        <ul className="space-y-2 text-xs text-bg-main/80">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                <span className="truncate">SN Trading Depot</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                                <a href="tel:+91 9356712710" className="hover:text-accent transition-colors">
                                    +91 93567 12710
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                                <a href="mailto:info@sntrading.com" className="hover:text-accent transition-colors truncate">
                                    info@sntrading.com
                                </a>
                            </li>
                        </ul>

                        <a
                            href="/sn-trading-catalogue.pdf"
                            download
                            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-accent/10 border border-accent/40 text-accent hover:bg-accent hover:text-primary text-xs font-bold transition-all shadow-xs mt-2"
                        >
                            <Download className="w-3.5 h-3.5 shrink-0" />
                            <span>Download Catalogue (PDF)</span>
                        </a>
                    </div>
                </aside>
            </div>
        </header>
    );
}