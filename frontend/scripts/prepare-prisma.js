/**
 * MISSIONWELL AI — Prisma Schema Provider Auto-Selector (Frontend)
 * Automatically configures schema.prisma based on DATABASE_URL (PostgreSQL vs SQLite)
 */

const fs = require("fs");
const path = require("path");

const prismaDir = path.join(__dirname, "..", "prisma");
const activeSchema = path.join(prismaDir, "schema.prisma");
const sqliteSchema = path.join(prismaDir, "schema.sqlite.prisma");
const pgSchema = path.join(prismaDir, "schema.postgresql.prisma");

if (!fs.existsSync(sqliteSchema) && fs.existsSync(activeSchema)) {
  fs.copyFileSync(activeSchema, sqliteSchema);
}

const dbUrl = (process.env.DATABASE_URL || "").trim();
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

if (isPostgres && fs.existsSync(pgSchema)) {
  console.log("[Prisma] Detected PostgreSQL DATABASE_URL. Applying PostgreSQL schema...");
  fs.copyFileSync(pgSchema, activeSchema);
} else if (fs.existsSync(sqliteSchema)) {
  console.log("[Prisma] Using SQLite schema.");
  fs.copyFileSync(sqliteSchema, activeSchema);
}
