import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PROTECTED: Staff/Admin only (Commercial Client Data)
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const bakeries = await prisma.bakery.findMany({
            where: { isArchived: false },
            include: {
                _count: { select: { customers: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(bakeries);
    } catch (error) {
        console.error("GET /api/bakeries error:", error);
        return NextResponse.json({ error: "Failed to fetch bakeries" }, { status: 500 });
    }
}

// PROTECTED: Staff/Admin creation
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const bakery = await prisma.bakery.create({
            data: {
                name: body.name,
                ownerName: body.ownerName,
                gstin: body.gstin || null,
                address: body.address,
                city: body.city,
                state: body.state || "Karnataka",
                pinCode: body.pinCode,
                phone: body.phone,
                email: body.email || null,
                website: body.website || null,
                notes: body.notes || null,
            },
        });
        return NextResponse.json(bakery, { status: 201 });
    } catch (error) {
        console.error("POST /api/bakeries error:", error);
        return NextResponse.json({ error: "Failed to create bakery" }, { status: 500 });
    }
}