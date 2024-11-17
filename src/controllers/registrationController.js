import registrationUtils from "../utils/registrationUtils.js";


/* 
* @Route - POST /registration/registration_add
* @params - email, session_id
* @desc - Controller - registration_add
*/

const registration_add = async (req, res) => {
	registrationUtils.insertMany(req, (err, result) => {
		res.json(result);
		return;
	});
}

/* 
* @Route - POST /registration/registration_delete
* @params - registration_id
* @desc - Controller - registration_delete
*/

const registration_delete = async (req, res) => {
	registrationUtils.deleteMany(req, (err, result) => {
		res.json(result);
		return;
	});
}

/* 
* @Route - POST /registration/registration_view
* @params - criteria,projection as objects
* @desc - Controller - registration_view
*/

const registration_view = async (req, res) => {
	registrationUtils.find(req, (err, result) => {
		res.json(result);
		return;
	});
}

const registrationController = { registration_add, registration_delete, registration_view };

export default registrationController;