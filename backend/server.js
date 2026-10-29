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
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins
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
    console.error("PostgreSQL connection failed:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
