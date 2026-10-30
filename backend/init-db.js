import fs from "fs";
import dns from "dns/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const databaseUrl = new URL(process.env.DATABASE_URL);
  const databaseHost = databaseUrl.hostname;
  databaseUrl.hostname = (await dns.lookup(databaseHost, { family: 4 })).address;
  databaseUrl.searchParams.delete("sslmode");

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const client = new Client({
      connectionString: databaseUrl.toString(),
      ssl: { rejectUnauthorized: true, servername: databaseHost }
    });

    try {
      console.log(`Initializing database (attempt ${attempt}/5)...`);
      await client.connect();
      await client.query(schema);
      await migrateLegacyPasswords(client);
      await provisionAdmin(client);
      console.log("Database initialized");
      return;
    } catch (error) {
      if (attempt === 5) {
        throw error;
      }

      console.error(
        `Database initialization attempt ${attempt} failed: ${error.message || error.code || "unknown error"}`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      await client.end().catch(() => {});
    }
  }
}

async function migrateLegacyPasswords(client) {
  for (const table of ["student", "admin"]) {
    const idColumn = table === "student" ? "student_id" : "admin_id";
    const result = await client.query(
      `SELECT ${idColumn}, password_hash
       FROM ${table}
       WHERE password_hash NOT LIKE '$2a$%'
         AND password_hash NOT LIKE '$2b$%'`
    );

    for (const row of result.rows) {
      const passwordHash = await bcrypt.hash(row.password_hash, 12);
      await client.query(
        `UPDATE ${table} SET password_hash = $1 WHERE ${idColumn} = $2`,
        [passwordHash, row[idColumn]]
      );
    }
  }
}

async function provisionAdmin(client) {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DEPARTMENT } = process.env;
  const values = [ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DEPARTMENT];

  if (values.every((value) => !value)) {
    return;
  }

  if (values.some((value) => !value)) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_DEPARTMENT must be configured together"
    );
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const result = await client.query(
    `INSERT INTO admin (name, email, password_hash, department_id)
     SELECT $1, $2, $3, department_id
     FROM department
     WHERE dept_name = $4
     ON CONFLICT (email) DO UPDATE
     SET name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash,
         department_id = EXCLUDED.department_id`,
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, ADMIN_DEPARTMENT]
  );

  if (result.rowCount !== 1) {
    throw new Error(`Admin department not found: ${ADMIN_DEPARTMENT}`);
  }
}

initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exitCode = 1;
});
