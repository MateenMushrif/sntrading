import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

// PROTECTED: Admin update staff details & roles
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

        const updated = await prisma.staff.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                roleId: body.roleId,
                department: body.department,
                designation: body.designation,
                status: body.status,
                notes: body.notes || null,
            },
            include: { role: true },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/staff/[id] error:", error);
        return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}

// PROTECTED: Admin archive & disable staff member
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

        const deleted = await prisma.staff.update({
            where: { id },
            data: { isArchived: true, status: "disabled" },
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("DELETE /api/staff/[id] error:", error);
        return NextResponse.json({ error: "Failed to disable staff" }, { status: 500 });
    }
}