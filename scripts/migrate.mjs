#!/usr/bin/env node
/**
 * Applies migrations/*.sql to the Neon database at DATABASE_URL during the
 * Vercel build — the same schema source src/lib/db.ts applies automatically
 * to the local PGLite fallback on startup (see its createPgliteSql()), so
 * dev/preview and production always agree on schema.
 *
 * No-op when DATABASE_URL is unset (CI, local dev without a real database):
 * there is nothing to migrate, since the PGLite fallback migrates itself.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.log("[migrate] DATABASE_URL not set — skipping (PGLite fallback migrates itself).");
  process.exit(0);
}

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");
const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query(
    "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
  );

  const files = (await readdir(migrationsDir)).filter((name) => name.endsWith(".sql")).sort();
  const { rows: done } = await pool.query("select name from _migrations");
  const doneNames = new Set(done.map((row) => row.name));

  for (const name of files) {
    if (doneNames.has(name)) continue;
    const sql = await readFile(path.join(migrationsDir, name), "utf8");
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into _migrations (name) values ($1)", [name]);
      await client.query("commit");
      console.log(`[migrate] applied ${name}`);
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  }

  console.log("[migrate] up to date.");
} finally {
  await pool.end();
}
