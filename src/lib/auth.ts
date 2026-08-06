import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to match your Prisma client export

export interface AuthSuccess {
    isValid: true;
    device: {
        id: string;
        deviceName: string;
        deviceId: string;
        token: string;
        status: string;
        staffId: string | null;
    };
}

export interface AuthFailure {
    isValid: false;
    response: NextResponse;
}

export type AuthResult = AuthSuccess | AuthFailure;

/**
 * Validates the hardware token (`x-device-token`) present in request headers.
 * Rejects requests if token is missing, unregistered, or not authorized.
 */
export async function validateDeviceToken(req: NextRequest): Promise<AuthResult> {
    const token = req.headers.get("x-device-token");

    // 1. Missing Header Check
    if (!token || !token.trim()) {
        return {
            isValid: false,
            response: NextResponse.json(
                { success: false, error: "Unauthorized: Missing x-device-token header." },
                { status: 401 }
            ),
        };
    }

    try {
        // 2. Database Lookup
        const device = await prisma.trustedDevice.findUnique({
            where: { token: token.trim() },
            select: {
                id: true,
                deviceName: true,
                deviceId: true,
                token: true,
                status: true,
                staffId: true,
            },
        });

        // 3. Unrecognized Token Check
        if (!device) {
            return {
                isValid: false,
                response: NextResponse.json(
                    { success: false, error: "Forbidden: Hardware device token not recognized." },
                    { status: 403 }
                ),
            };
        }

        // 4. Device Status Verification ("authorized" vs "disabled" / "revoked")
        if (device.status !== "authorized") {
            return {
                isValid: false,
                response: NextResponse.json(
                    {
                        success: false,
                        error: `Forbidden: Terminal access is currently ${device.status}.`,
                    },
                    { status: 403 }
                ),
            };
        }

        // 5. Update Last Active Timestamp (Non-blocking background update)
        prisma.trustedDevice
            .update({
                where: { id: device.id },
                data: { lastUsed: new Date() },
            })
            .catch((err) => console.error("Failed to update device lastUsed timestamp:", err));

        return { isValid: true, device };
    } catch (error) {
        console.error("Device token validation error:", error);
        return {
            isValid: false,
            response: NextResponse.json(
                { success: false, error: "Internal Server Error during auth verification." },
                { status: 500 }
            ),
        };
    }
}