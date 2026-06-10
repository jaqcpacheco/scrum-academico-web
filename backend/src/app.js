import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import historyRoutes from "./routes/historyRoutes.js";
import boardsRoutes from "./routes/boardsRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Muitas requisições. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);


app.get("/", (req, res) => {
  res.json({ status: "online", message: "Project Minds API" });
});


app.use("/api/users", loginLimiter, userRoutes);
app.use("/api/invites", inviteRoutes); // ✅ validate e accept são públicos


app.use("/api/boards", authMiddleware, boardsRoutes);
app.use("/api/metrics", authMiddleware, metricsRoutes);
app.use("/api/history", authMiddleware, historyRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
