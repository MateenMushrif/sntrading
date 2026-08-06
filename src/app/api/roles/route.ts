import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PROTECTED: Staff/Admin fetch system roles
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const roles = await prisma.role.findMany({
            include: { _count: { select: { staffMembers: true } } },
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(roles);
    } catch (error) {
        console.error("GET /api/roles error:", error);
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
    }
}

// PROTECTED: Staff/Admin create role
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const newRole = await prisma.role.create({
            data: {
                name: body.name,
                description: body.description,
                permissions: body.permissions || [],
                isSystemDefault: false,
            },
        });
        return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
        console.error("POST /api/roles error:", error);
        return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
    }
}