import HeroCarousel from "@/components/home/HeroCarousel";
import SearchAndCategories from "@/components/home/SearchAndCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // 1. Fetch Featured Categories with minimal select
  const categories = await prisma.category.findMany({
    where: {
      isFeatured: true,
    },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      description: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  // 2. Fetch Featured Products with targeted select (including specifications for instant QuickView)
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    take: 12,
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      status: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      thumbnailImage: {
        select: { id: true, secureUrl: true, altText: true },
      },
      specifications: {
        select: { id: true, label: true, value: true },
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 flex flex-col gap-4 md:gap-6">
      <HeroCarousel />
      <SearchAndCategories categories={categories} />
      <FeaturedProducts products={products} />
    </div>
  );
}