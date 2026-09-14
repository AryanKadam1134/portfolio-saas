import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configs
const privateCors = cors({
  origin: process.env.FRONTEND_URL.split(","),
  credentials: true,
});

const publicCors = cors({
  origin: "*",
});

app.use(express.json());
app.use(cookieParser());

// Private
import authRouter from "./routes/private/auth.routes.js";
import userRouter from "./routes/private/user.routes.js";
import skillRouter from "./routes/private/skill.routes.js";
import filterRoutes from "./routes/private/filter.routes.js";
import projectRouter from "./routes/private/project.routes.js";
import educationRouter from "./routes/private/education.routes.js";
import experienceRouter from "./routes/private/experience.routes.js";
import certificateRoutes from "./routes/private/certificate.routes.js";
import achievementRouter from "./routes/private/achievement.routes.js";
import skillCategoryRouter from "./routes/private/skillCategory.routes.js";
import socialPlatformRouter from "./routes/private/socialPlatform.routes.js";

import { healthCheck } from "./controllers/public/portfolio.controller.js";

app.get("/api/health", publicCors, healthCheck);

app.use("/api/admin", privateCors);

app.use("/api/admin/auth", authRouter);
app.use("/api/admin/users", userRouter);
app.use("/api/admin/skills", skillRouter);
app.use("/api/admin/filters", filterRoutes);
app.use("/api/admin/projects", projectRouter);
app.use("/api/admin/educations", educationRouter);
app.use("/api/admin/experiences", experienceRouter);
app.use("/api/admin/certificates", certificateRoutes);
app.use("/api/admin/achievements", achievementRouter);
app.use("/api/admin/skillCategories", skillCategoryRouter);
app.use("/api/admin/socialPlatforms", socialPlatformRouter);

// Public
import portfolioRouter from "./routes/public/portfolio.routes.js";

app.use("/api/portfolio", publicCors, portfolioRouter);

export default app;
