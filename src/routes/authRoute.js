import express from "express";
import { login, signup, logout, loginStatus } from "../controllers/authController.js";
import { show_session } from "../middlewares/requestMiddleware.js";
import { googleoauth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", show_session, googleoauth, login);
router.post("/signup", show_session, googleoauth, signup);
router.post("/logout", show_session, logout);
router.post("/loginstatus", show_session, loginStatus);

export default router;