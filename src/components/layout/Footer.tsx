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
        <footer className="bg-primary text-bg-main border-t border-border-subtle/20 mt-12 pt-10 pb-6 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
                {/* 4-Column Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-border-subtle/20">
                    {/* Brand & PDF Download */}
                    <div className="space-y-3">
                        <Link href="/" className="inline-block">
                            <h3 className="text-lg font-bold text-accent tracking-wide">
                                SN TRADING
                            </h3>
                        </Link>
                        <p className="text-bg-main/80 text-xs leading-relaxed">
                            Leading B2B wholesale distributor of raw bakery ingredients, chocolate compounds, cocoa, and margarine fats.
                        </p>
                        <a
                            href="/sn-trading-catalogue.pdf"
                            download
                            className="inline-flex items-center gap-2 bg-accent-subtle/10 border border-accent/40 text-accent hover:bg-accent hover:text-primary px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                            <Download className="h-3.5 w-3.5 shrink-0" />
                            <span>Download Full PDF Catalogue</span>
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-accent uppercase tracking-wider text-xs">
                            Quick Navigation
                        </h4>
                        <ul className="space-y-2 text-bg-main/80">
                            <li>
                                <Link href="/products" className="hover:text-accent transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories" className="hover:text-accent transition-colors">
                                    Categories Directory
                                </Link>
                            </li>
                            <li>
                                <Link href="/brands" className="hover:text-accent transition-colors">
                                    Authorized Brands
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-accent transition-colors">
                                    Inquiry Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Categories */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-accent uppercase tracking-wider text-xs">
                            Product Categories
                        </h4>
                        <ul className="space-y-2 text-bg-main/80">
                            <li>
                                <Link href="/categories/chocolate-cocoa" className="hover:text-accent transition-colors">
                                    Chocolate & Cocoa Powders
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/bakery-mixes" className="hover:text-accent transition-colors">
                                    Cake Premixes & Mixes
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/fats-margarine" className="hover:text-accent transition-colors">
                                    Margarines & Industrial Fats
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/flavors-emulsions" className="hover:text-accent transition-colors">
                                    Food Flavors & Colors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Direct Contact */}
                    <div className="space-y-2.5">
                        <h4 className="font-bold text-accent uppercase tracking-wider text-xs">
                            Commercial Trade Desk
                        </h4>
                        <ul className="space-y-2 text-bg-main/80">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                                <span>SN Trading Commercial Depot</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                                <a href="tel:+919356712710" className="hover:text-accent transition-colors">
                                    +91 93567 12710
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MessageSquare className="h-3.5 w-3.5 text-accent shrink-0" />
                                <a
                                    href="https://wa.me/919356712710"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                >
                                    WhatsApp Quick Quote
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                                <a href="mailto:info@sntrading.com" className="hover:text-accent transition-colors">
                                    info@sntrading.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Rights Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-bg-main/60 text-xs">
                    <p>© {new Date().getFullYear()} SN Trading. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-accent transition-colors">
                            Terms of Supply
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}