import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PROTECTED: Admin/Staff fetch customer directory
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const customers = await prisma.customer.findMany({
            where: { isArchived: false },
            include: { bakery: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(customers);
    } catch (error) {
        console.error("GET /api/customers error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}

// PROTECTED: Admin/Staff create customer record
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const customer = await prisma.customer.create({
            data: {
                fullName: body.fullName,
                mobilePrimary: body.mobilePrimary,
                mobileAlternate: body.mobileAlternate || null,
                email: body.email || null,
                bakeryId: body.bakeryId,
                designation: body.designation || "Buyer",
                gstin: body.gstin || null,
                notes: body.notes || null,
                status: body.status || "approved",
                productsInterested: body.productsInterested || [],
            },
            include: { bakery: true },
        });
        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error("POST /api/customers error:", error);
        return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
}