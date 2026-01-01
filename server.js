import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import planetsRoutes from "./routes/planets.js"; // adjust if your routes path differs

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- MongoDB ---------------- */
const MONGO = process.env.MONGODB_URI;

if (!MONGO) {
  console.warn("⚠️ MONGODB_URI is missing. API will run but DB routes will fail.");
} else {
  mongoose
    .connect(MONGO)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));
}

/* ---------------- Routes ---------------- */
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "NextPlanet backend running" });
});

app.use("/api/planets", planetsRoutes);

/* ---------------- Start ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));

