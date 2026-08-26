import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/category/CategoryCard";

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
        <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 space-y-6">
            <div className="border-b border-border-subtle pb-4">
                <h1 className="text-xl sm:text-2xl font-extrabold text-text-main tracking-tight">
                    Raw Material Categories
                </h1>
                <p className="mt-1 text-xs text-text-muted">
                    Explore our complete directory of commercial bakery ingredients and industrial wholesale supplies.
                </p>
            </div>

            {/* Prominent Large 3-4 Column Directory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {categories.map((cat, index: number) => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        priority={index < 4}
                    />
                ))}
            </div>
        </main>
    );
}