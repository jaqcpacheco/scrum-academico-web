import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import historyRoutes from "./routes/historyRoutes.js";
import boardsRoutes from "./routes/boardsRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//ROTAS
app.use("/api/boards", boardsRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/history", historyRoutes); 

export default app;