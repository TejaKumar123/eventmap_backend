import express from "express";
import feedbackController from "../controllers/feedbackController.js";

const router = express.Router();

router.use((req, res, next) => {
	console.log("feedback middleware");
	if (req?.session?.login == true && req?.session?.user?.email) {
		req.body.email = req.session.user.email
		next();
	}
	else {
		res.json({
			status: "error",
			message: "Permission denied",
		})
	}
})

router.post("/feedback_add", feedbackController.feedback_add);
router.post("/feedback_update", feedbackController.feedback_update);
router.post("/feedback_delete", feedbackController.feedback_delete);
router.post("/feedback_view", feedbackController.feedback_view);

export default router;