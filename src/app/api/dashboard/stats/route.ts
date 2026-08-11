import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [
            productsCount,
            categoriesCount,
            brandsCount,
            customersCount,
            bakeriesCount,
            trustedDevicesCount,
            recentProducts,
            topBakeries,
        ] = await Promise.all([
            prisma.product.count({ where: { status: "ACTIVE" } }),
            prisma.category.count(),
            prisma.brand.count(),
            prisma.customer.count({ where: { isArchived: false } }),
            prisma.bakery.count({ where: { isArchived: false } }),
            prisma.trustedDevice.count({ where: { status: "authorized" } }),
            prisma.product.findMany({
                take: 6,
                select: {
                    id: true,
                    name: true,
                    brand: {
                        select: { name: true },
                    },
                    thumbnailImage: {
                        select: { secureUrl: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.bakery.findMany({
                take: 4,
                where: { isArchived: false },
                select: {
                    id: true,
                    name: true,
                    ownerName: true,
                    phone: true,
                    city: true,
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            stats: {
                products: productsCount,
                categories: categoriesCount,
                brands: brandsCount,
                customers: customersCount,
                bakeries: bakeriesCount,
                staff: 4,
                trustedDevices: trustedDevicesCount,
            },
            recentProducts,
            unreadNotifsCount: 0,
            topBakeries,
        });
    } catch (error) {
        console.error("Dashboard Stats Route Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard metrics" },
            { status: 500 }
        );
    }
}