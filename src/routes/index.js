import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import sessionRouter from "./sessionRoute.js"
import registrationRouter from "./registrationRoute.js";
import feedbackRouter from "./feedbackRoute.js";

const router = express.Router()

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/session", sessionRouter);
router.use("/registration", registrationRouter);
router.use("/feedback", feedbackRouter);

export default router;