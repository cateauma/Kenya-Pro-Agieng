import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import beneficiariesRoutes from "./routes/beneficiaries.js";
import beneficiaryServicesRoutes from "./routes/beneficiary-services.js";
import programsRoutes from "./routes/programs.js";
import servicesRoutes from "./routes/services.js";
import donationsRoutes from "./routes/donations.js";
import volunteersRoutes from "./routes/volunteers.js";
import opportunitiesRoutes from "./routes/opportunities.js";
import notificationsRoutes from "./routes/notifications.js";
import infoRoutes from "./routes/info.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || "*",
    credentials: true,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests" },
});
app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/beneficiaries", beneficiariesRoutes);
app.use("/api/beneficiary", beneficiaryServicesRoutes);
app.use("/api/programs", programsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/donations", donationsRoutes);
app.use("/api/volunteers", volunteersRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/info", infoRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend build in production (single app)
if (isProduction) {
  const distPath = path.join(__dirname, "..", "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
