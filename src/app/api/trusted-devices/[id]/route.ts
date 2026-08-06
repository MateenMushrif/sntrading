import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

interface Params {
    params: Promise<{ id: string }>;
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-device-token",
        },
    });
}

// PROTECTED: Update device status (e.g. revoke, suspend, re-authorize)
export async function PATCH(
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
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        const updatedDevice = await prisma.trustedDevice.update({
            where: { id },
            data: { status },
            include: {
                staff: {
                    select: {
                        name: true,
                        role: { select: { name: true } },
                    },
                },
            },
        });

        return NextResponse.json(updatedDevice, {
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    } catch (error) {
        console.error("PATCH /api/trusted-devices/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to update device status" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}

// PROTECTED: Remove device record permanently
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

        await prisma.trustedDevice.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true },
            { headers: { "Access-Control-Allow-Origin": "*" } }
        );
    } catch (error) {
        console.error("DELETE /api/trusted-devices/[id] error:", error);
        return NextResponse.json(
            { error: "Failed to delete device record" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}