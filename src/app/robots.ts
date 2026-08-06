import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://sntrading.com"; // Replace with your production domain

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/cart/checkout"], // Disallow internal API routes and private cart checkout
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}