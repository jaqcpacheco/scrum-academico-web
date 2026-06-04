import express from "express";
import { fetchBoards } from "../controllers/boardsController.js";

const router = express.Router();

router.get("/", fetchBoards);

export default router;