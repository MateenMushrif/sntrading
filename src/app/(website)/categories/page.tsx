import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Layers, ArrowRight, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Bakery Material Categories | Wholesale Catalogue",
    description:
        "Browse SN Trading raw bakery ingredient categories: Chocolate Compounds, Cocoa Powders, Industrial Margarine & Fats, Premixes, and Flavors.",
    openGraph: {
        title: "Bakery Ingredient Categories | SN Trading Wholesale",
        description:
            "Explore bulk commercial bakery raw materials organized by product category.",
    },
};

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            image: true,
            _count: {
                select: { products: true },
            },
        },
        orderBy: { name: "asc" },
    });

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Raw Material Categories
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Explore our complete range of commercial bakery ingredients by category.
                </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categories.map((cat, index: number) => {
                    const imageUrl = typeof cat.image === "string" ? cat.image : null;

                    return (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`} // ✅ Direct canonical slug URL (No 308 redirect)
                            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all hover:border-amber-500 hover:shadow-md"
                        >
                            <div>
                                {/* Category Image Banner */}
                                <div
                                    className="relative w-full overflow-hidden border-b border-slate-100 bg-slate-50"
                                    style={{ aspectRatio: "16 / 9" }}
                                >
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={cat.name}
                                            fill
                                            priority={index < 4}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-slate-400">
                                            <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-xs">
                                                <Layers className="h-5 w-5 text-amber-500" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Products Count Badge */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-xs">
                                        <Package className="h-3 w-3 text-amber-500" />
                                        <span>{cat._count.products} Items</span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <h2 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-amber-600">
                                        {cat.name}
                                    </h2>

                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                                        {cat.description || "Commercial grade bakery materials and ingredients."}
                                    </p>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-semibold text-amber-600">
                                    <span>Browse Category</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}