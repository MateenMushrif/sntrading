import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";

// PROTECTED: Staff/Admin audit log access
export async function GET(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const logs = await prisma.activityLog.findMany({
            take: 50,
            orderBy: { createdAt: "desc" },
            include: { staff: true },
        });
        return NextResponse.json(logs);
    } catch (error) {
        console.error("GET /api/activity-logs error:", error);
        return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
    }
}