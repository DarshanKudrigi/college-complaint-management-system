import dotenv from "dotenv";
import dns from "dns/promises";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const databaseUrl = new URL(process.env.DATABASE_URL);
const databaseHost = databaseUrl.hostname;
const databaseIp = (await dns.lookup(databaseHost, { family: 4 })).address;
databaseUrl.hostname = databaseIp;
databaseUrl.searchParams.delete("sslmode");

const pool = new Pool({
  connectionString: databaseUrl.toString(),
  ssl: { rejectUnauthorized: true, servername: databaseHost },
  max: 10,
});

function toPostgresPlaceholders(query) {
  let parameterIndex = 0;
  return query.replace(/\?/g, () => `$${++parameterIndex}`);
}

export async function execute(query, parameters = []) {
  const result = await pool.query(toPostgresPlaceholders(query), parameters);
  const firstRow = result.rows[0];

  return [
    result.rows,
    {
      affectedRows: result.rowCount,
      insertId: firstRow?.id ?? firstRow?.complaint_id ?? firstRow?.status_id
    }
  ];
}

pool.execute = execute;

export async function testDbConnection() {
  await pool.query("SELECT 1");
}

export default pool;
