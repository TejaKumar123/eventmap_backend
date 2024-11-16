import express from "express";
import { login, signup, logout, loginStatus } from "../controllers/authController.js";
import { show_session } from "../middlewares/requestMiddleware.js";
import { googleoauth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(show_session);

router.post("/login", googleoauth, login);
router.post("/signup", googleoauth, signup);
router.post("/logout", logout);
router.post("/loginstatus", loginStatus);

export default router;