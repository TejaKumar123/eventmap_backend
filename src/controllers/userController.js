import userUtils from "../utils/userUtils.js";

/* 
* @route - /user/findUser
* @params - criteria, projectio as objects
* @desc - user - controller - findUser
*/

const findUser = async (req, res) => {
	userUtils.find(req, (err, result) => {
		res.json(result);
		return;
	})
}

export { findUser };