import express from "express";
import { fetchBoards } from "../controllers/boardsController.js";

const router = express.Router();

//GET /api/boards
router.get("/", fetchBoards);

export default router;