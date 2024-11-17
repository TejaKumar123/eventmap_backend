import express from "express"
import registrationController from "../controllers/registrationController.js";

const router = express.Router();

router.use((req, res, next) => {
	console.log("registration middleware");
	if (req?.session?.login == true) {
		next();
	}
	else {
		return res.json({
			status: "error",
			message: "Permission denied"
		})
	}
})

router.post("/registration_add", registrationController.registration_add);
router.post("/registration_delete", registrationController.registration_delete);
router.post("/registration_view", registrationController.registration_view);

export default router;


