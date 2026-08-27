import HeroCarousel, { HeroSlide, ActionType } from "@/components/home/HeroCarousel";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustValueStrip from "@/components/home/TrustValueStrip";
import BrandPartnerStrip from "@/components/home/BrandPartnerStrip";
import WholesaleCtaBanner from "@/components/home/WholesaleCtaBanner";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface SectionConfig {
  id: string;
  type: "hero" | "trust_strip" | "search_categories" | "brand_strip" | "featured_products" | "wholesale_cta";
  title: string;
  enabled: boolean;
  columns: 2 | 3 | 4 | 6;
}

const getGridClassName = (cols: number, type: string): string => {
  if (type === "search_categories") {
    switch (cols) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5";
      case 6:
      case 4:
      default:
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5";
    }
  }

  // Products (featured_products)
  switch (cols) {
    case 2:
      return "grid-cols-2 gap-4 sm:gap-5";
    case 3:
      return "grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4.5";
    case 4:
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
    case 6:
    default:
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3";
  }
};

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "sec-hero", type: "hero", title: "Hero Carousel", enabled: true, columns: 4 },
  { id: "sec-trust", type: "trust_strip", title: "Commercial Advantage Strip", enabled: true, columns: 4 },
  { id: "sec-search-categories", type: "search_categories", title: "Featured Categories", enabled: true, columns: 4 },
  { id: "sec-brands", type: "brand_strip", title: "Authorized Brand Partners", enabled: true, columns: 4 },
  { id: "sec-featured-products", type: "featured_products", title: "Featured Bakery Products", enabled: true, columns: 6 },
  { id: "sec-wholesale-cta", type: "wholesale_cta", title: "Contract Wholesale Banner", enabled: true, columns: 4 },
];

export default async function Home() {
  const [dbSections, dbSlides, categories, products, brands] = await Promise.all([
    prisma.storefrontSection.findMany({
      orderBy: { displayOrder: "asc" },
    }).catch(() => []),

    prisma.heroSlide.findMany({
      where: { isEnabled: true },
      orderBy: { displayOrder: "asc" },
    }).catch(() => []),

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
        brand: { select: { id: true, name: true, slug: true } },
        thumbnailImage: { select: { id: true, secureUrl: true, altText: true } },
        specifications: {
          select: { id: true, label: true, value: true },
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),

    prisma.brand.findMany({
      where: { isFeatured: true }, // <-- Fixed: now filters only featured brands
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ]);

  const slides: HeroSlide[] = dbSlides.map((s) => ({
    id: s.id,
    badge: s.badge ?? undefined,
    title: s.title,
    subtitle: s.subtitle,
    ctaText: s.ctaText ?? undefined,
    actionType: (s.actionType as ActionType) || "products",
    actionValue: s.actionValue ?? undefined,
    bgType: (s.bgType as "image" | "gradient" | "solid") || "gradient",
    bgValue: s.bgValue ?? undefined,
  }));

  let sections: SectionConfig[] = DEFAULT_SECTIONS;
  if (dbSections && dbSections.length > 0) {
    const loadedFromDb: SectionConfig[] = dbSections.map((s) => ({
      id: s.sectionKey || s.id,
      type: s.type as SectionConfig["type"],
      title: s.title,
      enabled: s.enabled,
      columns: (s.columns as 2 | 3 | 4 | 6) || 4,
    }));

    const existingTypes = new Set(loadedFromDb.map((s) => s.type));
    const missingSections = DEFAULT_SECTIONS.filter((s) => !existingTypes.has(s.type));
    sections = [...loadedFromDb, ...missingSections];
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-8 sm:gap-10">
      {sections.map((sec) => {
        if (!sec.enabled) return null;

        switch (sec.type) {
          case "hero":
            return <HeroCarousel key={sec.id} slides={slides.length > 0 ? slides : undefined} />;
          case "trust_strip":
            return <TrustValueStrip key={sec.id} />;
          case "search_categories":
            return (
              <SearchAndCategories
                key={sec.id}
                categories={categories}
                gridClassName={getGridClassName(sec.columns, "search_categories")}
              />
            );
          case "brand_strip":
            return <BrandPartnerStrip key={sec.id} brands={brands} />;
          case "featured_products":
            return (
              <FeaturedProducts
                key={sec.id}
                products={products}
                gridClassName={getGridClassName(sec.columns, "featured_products")}
              />
            );
          case "wholesale_cta":
            return <WholesaleCtaBanner key={sec.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
}