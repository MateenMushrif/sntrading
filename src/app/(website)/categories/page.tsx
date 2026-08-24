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
        <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
                    Raw Material Categories
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Explore our complete directory of commercial bakery ingredients and industrial wholesale supplies.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {categories.map((cat, index: number) => {
                    const imageUrl = typeof cat.image === "string" ? cat.image : null;

                    return (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-main shadow-xs hover:shadow-xl hover:border-accent transition-all duration-300"
                        >
                            <div>
                                <div className="relative w-full aspect-video overflow-hidden border-b border-border-subtle bg-bg-off">
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
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-bg-off text-text-muted">
                                            <div className="rounded-xl border border-border-subtle bg-bg-main p-3 shadow-xs">
                                                <Layers className="h-6 w-6 text-accent" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-main/95 px-2.5 py-1 text-xs font-bold text-text-main shadow-xs backdrop-blur-xs">
                                        <Package className="h-3.5 w-3.5 text-accent" />
                                        <span>{cat._count.products} Items</span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-1.5">
                                    <h2 className="text-sm sm:text-base font-bold text-text-main transition-colors group-hover:text-accent">
                                        {cat.name}
                                    </h2>

                                    <p className="line-clamp-2 text-xs text-text-muted leading-relaxed">
                                        {cat.description || "Commercial grade bakery raw materials, bulk packaging, and industrial supplies."}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs font-bold text-accent">
                                    <span>Browse Ingredients</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}