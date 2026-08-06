import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🌱 Starting database seed...");

    // 1. Clear existing data
    await prisma.trustedDevice.deleteMany(); // Added
    await prisma.productBadgeRelation.deleteMany();
    await prisma.productTagRelation.deleteMany();
    await prisma.relatedProduct.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productSpecification.deleteMany();
    await prisma.productFeature.deleteMany();
    await prisma.productApplication.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.tag.deleteMany();


    // 2. Create Brands
    const chococraft = await prisma.brand.create({
        data: {
            name: "ChocoCraft",
            slug: "chococraft",
            description: "Industrial chocolate & cocoa processing specialists.",
        },
    });

    const dutchbake = await prisma.brand.create({
        data: {
            name: "DutchBake",
            slug: "dutchbake",
            description: "Premium European cocoa and fat formulations.",
        },
    });

    // 3. Create Categories
    const catChocolate = await prisma.category.create({
        data: {
            name: "Chocolate & Cocoa",
            slug: "chocolate-and-cocoa",
            description: "Real cocoa butter chocolates, compounds, and cocoa powders.",
        },
    });

    const catFats = await prisma.category.create({
        data: {
            name: "Bakery Fats & Oils",
            slug: "bakery-fats-and-oils",
            description: "Specialized margarines, shortenings, and butter blends.",
        },
    });

    // 4. Create Badges
    const badgeBestseller = await prisma.badge.create({
        data: {
            name: "BESTSELLER",
            color: "#f59e0b",
            priority: 1,
        },
    });

    const badgePopular = await prisma.badge.create({
        data: {
            name: "POPULAR",
            color: "#10b981",
            priority: 2,
        },
    });

    // 5. Product 1: Pure White Chocolate Chips
    const prod1 = await prisma.product.create({
        data: {
            name: "Pure White Chocolate Chips",
            slug: "pure-white-chocolate-chips",
            shortDescription: "Premium grade cocoa butter-based white chocolate chips for commercial baking.",
            fullDescription: "Formulated specifically for high-heat bake stability in cookies, muffins, and artisan viennoiserie. High cocoa butter content ensures rich melt-in-mouth mouthfeel.",
            status: "ACTIVE",
            isFeatured: true,
            categoryId: catChocolate.id,
            brandId: chococraft.id,
            specifications: {
                create: [
                    { label: "Cocoa Butter Content", value: "32%", displayOrder: 1 },
                    { label: "Bake Stability", value: "Up to 200°C", displayOrder: 2 },
                    { label: "Shelf Life", value: "12 Months", displayOrder: 3 },
                    { label: "Country of Origin", value: "India", displayOrder: 4 },
                ],
            },
            features: {
                create: [
                    { feature: "Maintains chip structure post-baking", displayOrder: 1 },
                    { feature: "No artificial cocoa butter substitutes", displayOrder: 2 },
                ],
            },
            applications: {
                create: [
                    { application: "Cookies & Pastries", displayOrder: 1 },
                    { application: "Cake Decoration & Toppings", displayOrder: 2 },
                ],
            },
            variants: {
                create: [
                    { name: "Standard Carton", weightOrSize: "10 kg", sku: "WCC-10K", displayOrder: 1 },
                    { name: "Bulk Bag", weightOrSize: "25 kg", sku: "WCC-25K", displayOrder: 2 },
                ],
            },
        },
    });

    // Cloudinary metadata for Product 1
    const img1 = await prisma.productImage.create({
        data: {
            productId: prod1.id,
            cloudinaryPublicId: "sn_bakery/white_chocolate_chips_1",
            secureUrl: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80",
            altText: "Pure White Chocolate Chips in bulk container",
            width: 800,
            height: 800,
            format: "jpg",
            isThumbnail: true,
        },
    });

    // Link thumbnail
    await prisma.product.update({
        where: { id: prod1.id },
        data: { thumbnailImageId: img1.id },
    });

    // Badge Link
    await prisma.productBadgeRelation.create({
        data: { productId: prod1.id, badgeId: badgeBestseller.id },
    });

    // 6. Product 2: Dark Dutch Processed Cocoa Powder
    const prod2 = await prisma.product.create({
        data: {
            name: "Dark Dutch Processed Cocoa Powder",
            slug: "dark-dutch-processed-cocoa-powder",
            shortDescription: "Rich alkalized cocoa powder with 10-12% fat content for industrial baking.",
            fullDescription: "Deep chocolate flavor profile with a neutralized pH for balanced reactivity with leavening agents. Ideal for dark sponges, cookies, and chocolate beverages.",
            status: "ACTIVE",
            isFeatured: true,
            categoryId: catChocolate.id,
            brandId: dutchbake.id,
            specifications: {
                create: [
                    { label: "Fat Content", value: "10-12%", displayOrder: 1 },
                    { label: "pH Level", value: "7.2 - 7.6", displayOrder: 2 },
                    { label: "Packaging", value: "25kg Paper Bag with Poly Liner", displayOrder: 3 },
                ],
            },
            features: {
                create: [
                    { feature: "Alkalized for intense dark brown color", displayOrder: 1 },
                    { feature: "High solubility in milk and water solutions", displayOrder: 2 },
                ],
            },
            applications: {
                create: [
                    { application: "Chocolate Sponges & Brownies", displayOrder: 1 },
                    { application: "Frosting & Ganache", displayOrder: 2 },
                ],
            },
            variants: {
                create: [
                    { name: "Industrial Kraft Bag", weightOrSize: "25 kg", sku: "DCP-25K", displayOrder: 1 },
                ],
            },
        },
    });

    const img2 = await prisma.productImage.create({
        data: {
            productId: prod2.id,
            cloudinaryPublicId: "sn_bakery/dutch_cocoa_powder_1",
            secureUrl: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80",
            altText: "Dark Dutch Processed Cocoa Powder",
            width: 800,
            height: 800,
            format: "jpg",
            isThumbnail: true,
        },
    });

    await prisma.product.update({
        where: { id: prod2.id },
        data: { thumbnailImageId: img2.id },
    });

    await prisma.productBadgeRelation.create({
        data: { productId: prod2.id, badgeId: badgePopular.id },
    });

    // 7. Create Primary Hardware Terminal
    const trustedTerminal = await prisma.trustedDevice.create({
        data: {
            deviceName: "Admin Primary Terminal",
            deviceId: "SN-TERM-01",
            token: "dev-terminal-local-token-001",
            status: "authorized",
        },
    });

    console.log(`🔑 Terminal Token Created: ${trustedTerminal.token}`);
    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });