import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

// PROTECTED: Staff/Admin update customer details
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

        const updated = await prisma.customer.update({
            where: { id },
            data: {
                fullName: body.fullName,
                mobilePrimary: body.mobilePrimary,
                mobileAlternate: body.mobileAlternate || null,
                email: body.email || null,
                bakeryId: body.bakeryId,
                designation: body.designation,
                gstin: body.gstin || null,
                notes: body.notes || null,
                status: body.status,
            },
            include: { bakery: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/customers/[id] error:", error);
        return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
    }
}

// PROTECTED: Staff/Admin archive customer record
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

        const deleted = await prisma.customer.update({
            where: { id },
            data: { isArchived: true },
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("DELETE /api/customers/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }
}