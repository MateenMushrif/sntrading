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
            slides: slides.map((s) => ({
                id: s.id,
                badge: s.badge || undefined,
                title: s.title,
                subtitle: s.subtitle,
                ctaText: s.ctaText || undefined,
                actionType: s.actionType,
                actionValue: s.actionValue || undefined,
                bgType: s.bgType,
                bgValue: s.bgValue || undefined,
            })),
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

        await prisma.$transaction(async (tx) => {
            // 1. Sync Sections
            if (Array.isArray(sections)) {
                for (let i = 0; i < sections.length; i++) {
                    const sec = sections[i];
                    await tx.storefrontSection.upsert({
                        where: { sectionKey: sec.id },
                        update: {
                            type: sec.type,
                            title: sec.title,
                            enabled: Boolean(sec.enabled),
                            columns: Number(sec.columns) || 4,
                            displayOrder: i + 1,
                        },
                        create: {
                            sectionKey: sec.id,
                            type: sec.type,
                            title: sec.title,
                            enabled: Boolean(sec.enabled),
                            columns: Number(sec.columns) || 4,
                            displayOrder: i + 1,
                        },
                    });
                }
            }

            // 2. Sync Hero Slides
            if (Array.isArray(slides)) {
                const keptSlideIds: string[] = [];

                for (let i = 0; i < slides.length; i++) {
                    const slide = slides[i];
                    const slideIdStr = String(slide.id);

                    const existingSlide = await tx.heroSlide.findUnique({
                        where: { id: slideIdStr },
                        select: { id: true },
                    });

                    if (existingSlide) {
                        const updated = await tx.heroSlide.update({
                            where: { id: slideIdStr },
                            data: {
                                badge: slide.badge || null,
                                title: slide.title.trim(),
                                subtitle: slide.subtitle.trim(),
                                ctaText: slide.ctaText || null,
                                actionType: slide.actionType || "products",
                                actionValue: slide.actionValue || null,
                                bgType: slide.bgType || "gradient",
                                bgValue: slide.bgValue || null,
                                displayOrder: i + 1,
                                isEnabled: true,
                            },
                        });
                        keptSlideIds.push(updated.id);
                    } else {
                        const created = await tx.heroSlide.create({
                            data: {
                                badge: slide.badge || null,
                                title: slide.title.trim(),
                                subtitle: slide.subtitle.trim(),
                                ctaText: slide.ctaText || null,
                                actionType: slide.actionType || "products",
                                actionValue: slide.actionValue || null,
                                bgType: slide.bgType || "gradient",
                                bgValue: slide.bgValue || null,
                                displayOrder: i + 1,
                                isEnabled: true,
                            },
                        });
                        keptSlideIds.push(created.id);
                    }
                }

                await tx.heroSlide.deleteMany({
                    where: {
                        id: { notIn: keptSlideIds },
                    },
                });
            }
        });

        revalidatePath("/");
        revalidatePath("/preview");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/storefront/config error:", error);
        return NextResponse.json({ error: "Failed to publish storefront configuration" }, { status: 500 });
    }
}