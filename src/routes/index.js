import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import sessionRouter from "./sessionRoute.js";

const router = express.Router()

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/session", sessionRouter);

export default router;