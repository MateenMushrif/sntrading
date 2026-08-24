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
  type: "hero" | "search_categories" | "featured_products";
  title: string;
  enabled: boolean;
  columns: 2 | 3 | 4 | 6;
}

const getGridClassName = (cols: number): string => {
  switch (cols) {
    case 2:
      return "grid-cols-2 gap-3 sm:gap-4";
    case 3:
      return "grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4";
    case 4:
    case 6:
    default:
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
  }
};

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
      take: 8,
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
      take: 8,
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
      take: 6,
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

  const defaultSections: SectionConfig[] = [
    { id: "sec-hero", type: "hero", title: "Hero Carousel", enabled: true, columns: 4 },
    { id: "sec-search-categories", type: "search_categories", title: "Featured Categories", enabled: true, columns: 4 },
    { id: "sec-featured-products", type: "featured_products", title: "Featured Bakery Products", enabled: true, columns: 4 },
  ];

  const sections: SectionConfig[] = dbSections.length > 0
    ? dbSections.map((s) => ({
      id: s.sectionKey,
      type: s.type as "hero" | "search_categories" | "featured_products",
      title: s.title,
      enabled: s.enabled,
      columns: (s.columns as 2 | 3 | 4 | 6) || 4,
    }))
    : defaultSections;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col gap-8 sm:gap-10">
      {/* 1. Hero Carousel */}
      {sections.map((sec) => {
        if (!sec.enabled || sec.type !== "hero") return null;
        return <HeroCarousel key={sec.id} slides={slides.length > 0 ? slides : undefined} />;
      })}

      {/* 2. Commercial Advantages Strip */}
      <TrustValueStrip />

      {/* 3. Featured Categories */}
      {sections.map((sec) => {
        if (!sec.enabled || sec.type !== "search_categories") return null;
        return (
          <SearchAndCategories
            key={sec.id}
            categories={categories}
            gridClassName={getGridClassName(sec.columns)}
          />
        );
      })}

      {/* 4. Authorized Brand Partners */}
      <BrandPartnerStrip brands={brands} />

      {/* 5. Featured Bakery Materials */}
      {sections.map((sec) => {
        if (!sec.enabled || sec.type !== "featured_products") return null;
        return (
          <FeaturedProducts
            key={sec.id}
            products={products}
            gridClassName={getGridClassName(sec.columns)}
          />
        );
      })}

      {/* 6. High-Conversion Quote Banner */}
      <WholesaleCtaBanner />
    </div>
  );
}