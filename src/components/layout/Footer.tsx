import Link from "next/link";
import {
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    Download,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-bg-main border-t border-white/10 mt-8 sm:mt-12 pt-12 sm:pt-16 pb-6 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Main Footer Container */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-8 border-b border-white/10">

                    {/* 1. Company Info & Download CTA */}
                    <div className="lg:col-span-2 space-y-3">
                        <Link href="/" className="inline-block">
                            <h3 className="text-lg sm:text-xl font-bold text-accent tracking-wide">
                                SN TRADING
                            </h3>
                        </Link>
                        <p className="text-gray-300 text-xs leading-relaxed max-w-sm">
                            Leading wholesale supplier of premium bakery raw materials, high-grade cocoa, specialty fats, and bakery pre-mixes.
                        </p>

                        {/* Compact Download CTA */}
                        <div className="pt-1">
                            <a
                                href="/sn-trading-catalogue.pdf"
                                download
                                className="inline-flex items-center gap-2 bg-accent/10 border border-accent/40 hover:bg-accent hover:text-primary text-accent px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                                <Download className="w-3.5 h-3.5 shrink-0" />
                                <span>Download Catalogue (PDF)</span>
                            </a>
                        </div>

                        {/* Social Media Links */}
                        <div className="pt-1">
                            <div className="flex items-center gap-2.5 text-bg-main">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-primary-hover border border-white/10 rounded-full hover:border-accent hover:text-accent transition-colors"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-primary-hover border border-white/10 rounded-full hover:border-accent hover:text-accent transition-colors"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-primary-hover border border-white/10 rounded-full hover:border-accent hover:text-accent transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-primary-hover border border-white/10 rounded-full hover:border-accent hover:text-accent transition-colors"
                                    aria-label="Twitter"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 2. Side-by-Side 2-Column Section on Mobile */}
                    <div className="grid grid-cols-2 lg:col-span-2 gap-6">
                        <div>
                            <h4 className="font-bold text-accent mb-2.5 uppercase tracking-wider text-xs">
                                Quick Links
                            </h4>
                            <ul className="space-y-2 text-gray-300">
                                <li>
                                    <Link href="/products" className="hover:text-accent transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories" className="hover:text-accent transition-colors">
                                        Categories
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/brands" className="hover:text-accent transition-colors">
                                        Brands
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cart" className="hover:text-accent transition-colors">
                                        Inquiry Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-accent transition-colors">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-accent mb-2.5 uppercase tracking-wider text-xs">
                                Categories
                            </h4>
                            <ul className="space-y-2 text-gray-300">
                                <li>
                                    <Link href="/categories/chocolate-cocoa" className="hover:text-accent transition-colors">
                                        Chocolate & Cocoa
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/bakery-mixes" className="hover:text-accent transition-colors">
                                        Bakery Mixes
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/fats-margarine" className="hover:text-accent transition-colors">
                                        Fats & Margarine
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/flavors-emulsions" className="hover:text-accent transition-colors">
                                        Flavors
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/categories/decorations-toppings" className="hover:text-accent transition-colors">
                                        Toppings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Contact Details */}
                    <div>
                        <h4 className="font-bold text-accent mb-2.5 uppercase tracking-wider text-xs">
                            Contact Us
                        </h4>
                        <ul className="space-y-2.5 text-gray-300">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                <span className="leading-tight">SN Trading Depot</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-accent transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-accent shrink-0" />
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                >
                                    WhatsApp Quote
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                                <a href="mailto:info@sntrading.com" className="hover:text-accent transition-colors">
                                    info@sntrading.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-gray-400 text-xs text-center sm:text-left">
                    <p>© {new Date().getFullYear()} SN Trading. All rights reserved.</p>

                    <div className="flex items-center gap-4">
                        <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-accent transition-colors">
                            Terms
                        </Link>
                        <Link href="/contact" className="hover:text-accent transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}