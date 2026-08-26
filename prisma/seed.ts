import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Seeding 6 Storefront Sections...");

    const defaultSections = [
        {
            sectionKey: "sec-hero",
            type: "hero",
            title: "Hero Carousel",
            enabled: true,
            columns: 4,
            displayOrder: 0,
        },
        {
            sectionKey: "sec-trust",
            type: "trust_strip",
            title: "Commercial Advantage Strip",
            enabled: true,
            columns: 4,
            displayOrder: 1,
        },
        {
            sectionKey: "sec-search-categories",
            type: "search_categories",
            title: "Featured Categories",
            enabled: true,
            columns: 6,
            displayOrder: 2,
        },
        {
            sectionKey: "sec-brands",
            type: "brand_strip",
            title: "Authorized Brand Partners",
            enabled: true,
            columns: 4,
            displayOrder: 3,
        },
        {
            sectionKey: "sec-featured-products",
            type: "featured_products",
            title: "Featured Bakery Products",
            enabled: true,
            columns: 6,
            displayOrder: 4,
        },
        {
            sectionKey: "sec-wholesale-cta",
            type: "wholesale_cta",
            title: "Contract Wholesale Banner",
            enabled: true,
            columns: 4,
            displayOrder: 5,
        },
    ];

    for (const section of defaultSections) {
        await prisma.storefrontSection.upsert({
            where: { sectionKey: section.sectionKey },
            update: {
                type: section.type,
                title: section.title,
                columns: section.columns,
                displayOrder: section.displayOrder,
            },
            create: section,
        });
    }

    console.log("Seeding Hero Slides...");
    const defaultSlides = [
        {
            id: "slide_1",
            badge: "SN Trading Exclusive",
            title: "Premium Wholesale Bakery Ingredients",
            subtitle: "Direct B2B supply of chocolate, cocoa powders, and essential baking raw materials.",
            ctaText: "Browse Catalogue",
            actionType: "products",
            bgType: "gradient",
            bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #78350f 100%)",
            displayOrder: 0,
            isEnabled: true,
        },
        {
            id: "slide_2",
            badge: "Industrial Supply",
            title: "Bulk Margarine, Fats & Emulsifiers",
            subtitle: "High-performance fats formulated for commercial bakeries and confectionery success.",
            ctaText: "Explore Fats & Oils",
            actionType: "category",
            actionValue: "fats-margarine",
            bgType: "gradient",
            bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e3a8a 100%)",
            displayOrder: 1,
            isEnabled: true,
        },
        {
            id: "slide_3",
            badge: "Certified Quality",
            title: "Signature Flavors & Food Colors",
            subtitle: "Concentrated flavoring agents and vibrant food dyes for professional creation.",
            ctaText: "View Categories",
            actionType: "category",
            actionValue: "flavors-emulsions",
            bgType: "gradient",
            bgValue: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #064e3b 100%)",
            displayOrder: 2,
            isEnabled: true,
        },
    ];

    for (const slide of defaultSlides) {
        await prisma.heroSlide.upsert({
            where: { id: slide.id },
            update: slide,
            create: slide,
        });
    }

    console.log("Database seeded successfully with all 6 sections and slides!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });