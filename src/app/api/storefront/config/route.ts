import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateDeviceToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface SectionPayload {
    id: string;
    type: string;
    title: string;
    enabled: boolean;
    columns?: number;
}

interface SlidePayload {
    id: string | number;
    badge?: string | null;
    title: string;
    subtitle: string;
    ctaText?: string | null;
    actionType?: string;
    actionValue?: string | null;
    bgType?: string;
    bgValue?: string | null;
}

export async function GET() {
    try {
        const [sections, slides] = await Promise.all([
            prisma.storefrontSection.findMany({
                orderBy: { displayOrder: "asc" },
            }),
            prisma.heroSlide.findMany({
                where: { isEnabled: true },
                orderBy: { displayOrder: "asc" },
            }),
        ]);

        return NextResponse.json({
            sections: sections.map((s) => ({
                id: s.sectionKey,
                type: s.type,
                title: s.title,
                enabled: s.enabled,
                columns: s.columns,
            })),
            slides,
        });
    } catch (error) {
        console.error("GET /api/storefront/config error:", error);
        return NextResponse.json({ error: "Failed to fetch storefront config" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await validateDeviceToken(request);
    if (!auth.isValid) {
        return auth.response;
    }

    try {
        const body = (await request.json()) as {
            sections?: SectionPayload[];
            slides?: SlidePayload[];
        };
        const { sections, slides } = body;

        // 1. Sync sections & grid columns to PostgreSQL
        if (Array.isArray(sections)) {
            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                await prisma.storefrontSection.upsert({
                    where: { sectionKey: sec.id },
                    update: {
                        type: sec.type,
                        title: sec.title,
                        enabled: Boolean(sec.enabled),
                        columns: Number(sec.columns) || 6,
                        displayOrder: i + 1,
                    },
                    create: {
                        sectionKey: sec.id,
                        type: sec.type,
                        title: sec.title,
                        enabled: Boolean(sec.enabled),
                        columns: Number(sec.columns) || 6,
                        displayOrder: i + 1,
                    },
                });
            }
        }

        // 2. Sync Hero Slides to PostgreSQL
        if (Array.isArray(slides)) {
            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                const rawId = String(slide.id);
                const slideId = rawId.startsWith("slide_") || typeof slide.id === "number" ? undefined : rawId;

                if (slideId) {
                    await prisma.heroSlide.upsert({
                        where: { id: slideId },
                        update: {
                            badge: slide.badge || null,
                            title: slide.title,
                            subtitle: slide.subtitle,
                            ctaText: slide.ctaText || null,
                            actionType: slide.actionType || "products",
                            actionValue: slide.actionValue || null,
                            bgType: slide.bgType || "gradient",
                            bgValue: slide.bgValue || null,
                            displayOrder: i + 1,
                        },
                        create: {
                            badge: slide.badge || null,
                            title: slide.title,
                            subtitle: slide.subtitle,
                            ctaText: slide.ctaText || null,
                            actionType: slide.actionType || "products",
                            actionValue: slide.actionValue || null,
                            bgType: slide.bgType || "gradient",
                            bgValue: slide.bgValue || null,
                            displayOrder: i + 1,
                        },
                    });
                } else {
                    await prisma.heroSlide.create({
                        data: {
                            badge: slide.badge || null,
                            title: slide.title,
                            subtitle: slide.subtitle,
                            ctaText: slide.ctaText || null,
                            actionType: slide.actionType || "products",
                            actionValue: slide.actionValue || null,
                            bgType: slide.bgType || "gradient",
                            bgValue: slide.bgValue || null,
                            displayOrder: i + 1,
                        },
                    });
                }
            }
        }

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/storefront/config error:", error);
        return NextResponse.json({ error: "Failed to publish storefront configuration" }, { status: 500 });
    }
}