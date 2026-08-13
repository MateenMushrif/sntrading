import HeroCarousel from "@/components/home/HeroCarousel";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface SectionConfig {
  id: string;
  type: "hero" | "search_categories" | "featured_products";
  title: string;
  enabled: boolean;
  columns: 2 | 3 | 4 | 6;
}

export default async function Home() {
  // 1. Fetch Storefront Config & Live Data in Parallel
  const [configRecord, categories, products] = await Promise.all([
    prisma.storefrontConfig.findUnique({ where: { id: "default" } }).catch(() => null),
    prisma.category.findMany({
      where: { isFeatured: true },
      take: 12,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      take: 12,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        status: true,
        category: { select: { id: true, name: true, slug: true } },
        thumbnailImage: { select: { id: true, secureUrl: true, altText: true } },
        specifications: {
          select: { id: true, label: true, value: true },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const config = configRecord?.config as { sections?: SectionConfig[]; slides?: any[] } | null;

  // Default fallback layout if config hasn't been saved yet
  const sections: SectionConfig[] = config?.sections || [
    { id: "sec-hero", type: "hero", title: "Hero Carousel", enabled: true, columns: 4 },
    { id: "sec-search-categories", type: "search_categories", title: "Featured Categories", enabled: true, columns: 6 },
    { id: "sec-featured-products", type: "featured_products", title: "Featured Bakery Products", enabled: true, columns: 6 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 flex flex-col gap-4 md:gap-6">
      {sections.map((sec) => {
        if (!sec.enabled) return null;

        if (sec.type === "hero") {
          return <HeroCarousel key={sec.id} slides={config?.slides} />;
        }

        if (sec.type === "search_categories") {
          return <SearchAndCategories key={sec.id} categories={categories} />;
        }

        if (sec.type === "featured_products") {
          return <FeaturedProducts key={sec.id} products={products} />;
        }

        return null;
      })}
    </div>
  );
}