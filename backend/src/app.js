import express from "express";
import cors from "cors";
import trelloRoutes from "./routes/trelloRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", trelloRoutes);

export default app;