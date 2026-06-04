import express from "express";

import {

  loginUser,
  connectTrello,
  disconnectTrello

} from "../controllers/userController.js";

const router =
  express.Router();

router.post(
  "/login",
  loginUser
);

router.post(
  "/connect-trello",
  connectTrello
);

router.post(
  "/disconnect-trello",
  disconnectTrello
);
export default router;