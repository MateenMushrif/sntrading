import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

// PROTECTED: Staff/Admin update bakery details
export async function PUT(
    request: NextRequest,
    { params }: Params
) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const updated = await prisma.bakery.update({
            where: { id },
            data: {
                name: body.name,
                ownerName: body.ownerName,
                gstin: body.gstin || null,
                address: body.address,
                city: body.city,
                state: body.state,
                pinCode: body.pinCode,
                phone: body.phone,
                email: body.email || null,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/bakeries/[id] error:", error);
        return NextResponse.json({ error: "Failed to update bakery" }, { status: 500 });
    }
}

// PROTECTED: Staff/Admin archive bakery
export async function DELETE(
    request: NextRequest,
    { params }: Params
) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const { id } = await params;

        const deleted = await prisma.bakery.update({
            where: { id },
            data: { isArchived: true },
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("DELETE /api/bakeries/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete bakery" }, { status: 500 });
    }
}