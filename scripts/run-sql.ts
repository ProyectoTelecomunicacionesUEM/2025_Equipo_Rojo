import { readFileSync } from "fs";
import { resolve } from "path";
import { Pool } from "pg";

const file = process.argv[2];

if (!file) {
  console.error("Uso: tsx scripts/run-sql.ts <path-a-sql>");
  process.exit(1);
}

const sql = readFileSync(resolve(file), "utf8");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await pool.query("BEGIN");
    await pool.query(sql);
    await pool.query("COMMIT");
    console.log(`OK: ${file}`);
  } catch (e) {
    await pool.query("ROLLBACK");
    console.error("ERROR:", (e as Error).message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
