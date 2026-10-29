import fs from "fs";
import dns from "dns/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

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
      ssl: { rejectUnauthorized: false, servername: databaseHost }
    });

    try {
      console.log(`Initializing database (attempt ${attempt}/5)...`);
      await client.connect();
      await client.query(schema);
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

initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exitCode = 1;
});
