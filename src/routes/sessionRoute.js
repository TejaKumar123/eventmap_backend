import express from "express";
import { session_add, session_delete, session_update, session_view } from "../controllers/sessionController.js";
const router = express.Router();

router.use((req, res, next) => {
	console.log("session middleware");
	if (req?.session?.login == true && req?.session?.user?.email) {
		req.body.email=req.session.user.email;
		next();
	}
	else {
		return res.json({
			status: "error",
			message: "Permission denied"
		})
	}
})

router.post("/session_add", session_add);
router.post("/session_update", session_update);
router.post("/session_delete", session_delete);
router.post("/session_view", session_view);

export default router;
