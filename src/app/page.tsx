import HeroCarousel from "@/components/home/HeroCarousel";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";

// Force Next.js to fetch fresh live data from Neon DB on every page request
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: {
      isFeatured: true,
    },
    take: 8,
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    take: 12,
    include: {
      thumbnailImage: true,
      images: true,
      category: true,
      brand: true,
      badges: {
        include: {
          badge: true,
        },
      },
      variants: true,
      specifications: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 flex flex-col gap-4 md:gap-6">
      <HeroCarousel />
      <SearchAndCategories categories={categories} />
      <FeaturedProducts products={products as unknown as Product[]} />
    </div>
  );
}