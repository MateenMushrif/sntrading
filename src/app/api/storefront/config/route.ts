import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET: Serve published config to Homepage & Tauri App
export async function GET() {
  try {
    const record = await prisma.storefrontConfig.findUnique({
      where: { id: "default" },
    });

    if (!record) {
      return NextResponse.json(null);
    }

    return NextResponse.json(record.config);
  } catch (error) {
    console.error("GET /api/storefront/config error:", error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

// POST: Save published config from Tauri Admin App
export async function POST(request: NextRequest) {
  const auth = await validateDeviceToken(request);
  if (!auth.isValid) {
    return auth.response;
  }

  try {
    const body = await request.json();

    const updated = await prisma.storefrontConfig.upsert({
      where: { id: "default" },
      update: { config: body },
      create: { id: "default", config: body },
    });

    // Invalidate Next.js cache so the public homepage updates instantly
    revalidatePath("/");

    return NextResponse.json({ success: true, config: updated.config });
  } catch (error) {
    console.error("POST /api/storefront/config error:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}