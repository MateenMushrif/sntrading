"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { productService } from "@/services/product.service";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const [formData, setFormData] = useState({
        buyerName: "",
        businessName: "",
        phone: "",
        email: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const response = await productService.submitInquiry({
                ...formData,
                items: cart,
            });

            setSuccess(true);
            clearCart();

            if (response?.whatsappUrl) {
                window.open(response.whatsappUrl, "_blank");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to submit inquiry";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-12 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Your Inquiry Cart is Empty</h2>
                    <p className="text-xs text-slate-500 mb-6">
                        Browse our catalog and add bulk raw materials to request a personalized quote.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Explore Catalogue
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6">B2B Wholesale Inquiry Cart</h1>

            {success ? (
                <div className="bg-slate-50 border border-emerald-400/40 rounded-xl p-8 text-center max-w-lg mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Inquiry Submitted Successfully!</h2>
                    <p className="text-xs text-slate-500 mb-6">
                        We have generated your request details. If WhatsApp did not launch automatically, click below to continue.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                        Continue Browsing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Cart Items List */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Selected Materials ({cart.length})
                                </span>
                                <button
                                    onClick={clearCart}
                                    type="button"
                                    className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {cart.map((item) => {
                                    const variantId = item.variant.id;
                                    const weightLabel = item.variant.weightOrSize || "Standard";

                                    return (
                                        <div key={variantId} className="p-4 flex gap-4 items-center">
                                            <div className="relative w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                                                <Image
                                                    src={
                                                        item.product.thumbnailImage?.secureUrl ||
                                                        item.product.images?.[0]?.secureUrl ||
                                                        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                                                    }
                                                    alt={item.product.name}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Packaging: <span className="font-semibold text-slate-700">{weightLabel}</span>
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(variantId, Math.max(1, item.quantity - 1))}
                                                    className="text-xs font-bold text-slate-500 hover:text-slate-900 px-1 cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-bold w-6 text-center select-none">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(variantId, item.quantity + 1)}
                                                    className="text-xs font-bold text-slate-500 hover:text-slate-900 px-1 cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeFromCart(variantId)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Inquiry Form */}
                    <div className="lg:col-span-5">
                        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm sticky top-20">
                            <h3 className="text-sm font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                                Business Inquiry Details
                            </h3>

                            {error && (
                                <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-semibold">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmitInquiry} className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="buyerName"
                                        required
                                        value={formData.buyerName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Abdul Mateen"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Business / Bakery Name
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Royal Bakery & Confectionery"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        WhatsApp Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 9356712710"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                                        Special Remarks / Requirements
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Require GST invoice, delivery needed in Pune..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-amber-400 text-slate-900 font-bold py-2.5 rounded-full flex items-center justify-center gap-2 text-xs hover:bg-amber-500 transition-all shadow-md disabled:opacity-50 mt-4 cursor-pointer"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Inquiry via WhatsApp
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}