import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // Fast ping query to wake up Neon compute pool and Vercel container
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ status: "warm" });
    } catch {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }
}