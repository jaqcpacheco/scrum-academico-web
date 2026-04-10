import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import boardsRoutes from "./routes/boards.js";
import metricsRoutes from "./routes/metrics.js";

app.use("/api/boards", boardsRoutes);
app.use("/api/metrics", metricsRoutes);

export default app;