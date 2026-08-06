// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                accent: "var(--color-accent)",
                "bg-main": "var(--color-bg-main)",
                "bg-off": "var(--color-bg-off)",
                "text-main": "var(--color-text-main)",
                "text-muted": "var(--color-text-muted)",
            },
            fontSize: {
                "2xs": ["0.625rem", { lineHeight: "0.75rem" }], // Replaces broken arbitrary text-[10px]
            },
        },
    },
    plugins: [],
};

export default config;