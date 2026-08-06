import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PROTECTED: Admin fetch staff directory & trusted devices
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const staff = await prisma.staff.findMany({
            where: { isArchived: false },
            include: {
                role: true,
                trustedDevices: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(staff);
    } catch (error) {
        console.error("GET /api/staff error:", error);
        return NextResponse.json({ error: "Failed to fetch staff directory" }, { status: 500 });
    }
}

// PROTECTED: Admin onboard staff member
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const newStaff = await prisma.staff.create({
            data: {
                name: body.name,
                username: body.username || body.email.split("@")[0],
                passwordHash: body.passwordHash || "default_hashed_pass",
                email: body.email,
                phone: body.phone,
                department: body.department || "Operations",
                designation: body.designation || "Staff",
                roleId: body.roleId,
                notes: body.notes || null,
            },
            include: { role: true },
        });

        // Audit Log
        await prisma.activityLog.create({
            data: {
                action: "Staff Onboarded",
                target: newStaff.name,
                staffId: newStaff.id,
            },
        });

        return NextResponse.json(newStaff, { status: 201 });
    } catch (error) {
        console.error("POST /api/staff error:", error);
        return NextResponse.json({ error: "Failed to onboard staff" }, { status: 500 });
    }
}