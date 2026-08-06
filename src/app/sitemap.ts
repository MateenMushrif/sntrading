import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 86400; // Revalidate sitemap once per day (in seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sntrading.com";

    // 1. Static site routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/brands`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // 2. Fetch dynamic Categories from DB
    const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${baseUrl}/categories/${cat.slug}`,
        lastModified: cat.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // 3. Fetch dynamic Brands from DB
    const brands = await prisma.brand.findMany({
        select: { slug: true, updatedAt: true },
    });

    const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
        url: `${baseUrl}/brands/${brand.slug}`,
        lastModified: brand.updatedAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // 4. Fetch dynamic Products from DB
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: prod.updatedAt || new Date(),
        changeFrequency: "daily",
        priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}