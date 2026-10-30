import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";
import adminRoutes from "./routes/admin.js";
import { testDbConnection } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

async function start() {
  try {
    await testDbConnection();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection failed. Server will not start:", error.message);
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
