import express from "express";
import authController from "../controllers/authController.js";
import { show_session } from "../middlewares/requestMiddleware.js";
import { googleoauth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(show_session);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.post("/loginstatus", authController.loginStatus);

export default router;