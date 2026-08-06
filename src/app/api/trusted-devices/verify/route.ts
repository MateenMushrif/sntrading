import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Preflight CORS handler for browser/Tauri requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-device-token",
        },
    });
}

// PUBLIC: Entry point for hardware device verification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, deviceId } = body;

        if (!token || typeof token !== "string") {
            return NextResponse.json(
                { valid: false, error: "Token is required" },
                { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        if (!deviceId || typeof deviceId !== "string") {
            return NextResponse.json(
                { valid: false, error: "Hardware Device ID is required for device verification" },
                { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        // STRICT CHECK: Both token AND deviceId must match the SAME record
        const device = await prisma.trustedDevice.findFirst({
            where: {
                token: token.trim(),
                deviceId: deviceId.trim(),
            },
        });

        if (!device || device.status !== "authorized") {
            return NextResponse.json(
                { valid: false, error: "This token is not authorized for this specific computer." },
                { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        // Update lastUsed timestamp
        await prisma.trustedDevice.update({
            where: { id: device.id },
            data: { lastUsed: new Date() },
        });

        return NextResponse.json(
            {
                valid: true,
                device: {
                    id: device.id,
                    deviceName: device.deviceName,
                    deviceId: device.deviceId,
                    status: device.status,
                },
            },
            { headers: { "Access-Control-Allow-Origin": "*" } }
        );
    } catch (error) {
        console.error("POST /api/trusted-devices/verify error:", error);
        return NextResponse.json(
            { valid: false, error: "Internal server error" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}