import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || searchParams.get("query") || "").trim();

    if (!query) {
        return NextResponse.json({
            products: [],
            categories: [],
            brands: [],
            bakeries: [],
            customers: [],
            staff: [],
        });
    }

    try {
        const [products, categories, brands, bakeries, customers, staff] = await Promise.all([
            // 1. Products (by name, slug, SKU)
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { slug: { contains: query, mode: "insensitive" } },
                        { variants: { some: { sku: { contains: query, mode: "insensitive" } } } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, slug: true },
            }),

            // 2. Categories
            prisma.category.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { slug: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, slug: true },
            }),

            // 3. Brands
            prisma.brand.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { slug: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, slug: true },
            }),

            // 4. Bakeries
            prisma.bakery.findMany({
                where: {
                    isArchived: false,
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { ownerName: { contains: query, mode: "insensitive" } },
                        { city: { contains: query, mode: "insensitive" } },
                        { phone: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, ownerName: true, city: true, phone: true },
            }),

            // 5. Customers
            prisma.customer.findMany({
                where: {
                    isArchived: false,
                    OR: [
                        { fullName: { contains: query, mode: "insensitive" } },
                        { mobilePrimary: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, fullName: true, mobilePrimary: true, designation: true },
            }),

            // 6. Staff
            prisma.staff.findMany({
                where: {
                    isArchived: false,
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                        { username: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 5,
                select: { id: true, name: true, email: true, department: true },
            }),
        ]);

        return NextResponse.json({
            products,
            categories,
            brands,
            bakeries,
            customers,
            staff,
        });
    } catch (error) {
        console.error("Admin Omni-Search Error:", error);
        return NextResponse.json(
            { error: "Failed to execute administrative search" },
            { status: 500 }
        );
    }
}