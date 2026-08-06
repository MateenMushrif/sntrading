import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI uses this URL for migrations/push.
    // We use DIRECT_URL so CLI bypasses PgBouncer pooling.
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});