import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// Preflight CORS handler for browser/Tauri requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-device-token",
        },
    });
}

// PROTECTED: Admin/Staff list registered devices
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const devices = await prisma.trustedDevice.findMany({
            include: {
                staff: {
                    select: {
                        name: true,
                        role: {
                            select: { name: true },
                        },
                    },
                },
            },
            orderBy: {
                lastUsed: "desc",
            },
        });

        return NextResponse.json(devices, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("GET /api/trusted-devices error:", error);
        return NextResponse.json(
            { error: "Failed to fetch devices" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}

// PROTECTED / ONBOARDING: Register / Authorize a new device
export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = await request.json();
        const { deviceName, deviceId, token, staffId, status } = body;

        if (!deviceName || !deviceId || !token) {
            return NextResponse.json(
                { error: "Device name, hardware deviceId, and secret token are required" },
                { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
            );
        }

        const newDevice = await prisma.trustedDevice.create({
            data: {
                deviceName,
                deviceId,
                token: token.trim(),
                status: status || "authorized",
                staffId: staffId || null,
            },
            include: {
                staff: {
                    select: {
                        name: true,
                        role: { select: { name: true } },
                    },
                },
            },
        });

        return NextResponse.json(newDevice, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("POST /api/trusted-devices error:", error);
        return NextResponse.json(
            { error: "Failed to create device record" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}