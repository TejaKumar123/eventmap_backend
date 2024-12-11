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

/* 
* @route - /user/deleteUser
* @params - email of user to remove
* @desc - user - controller - deleteUser
*/

const deleteUser = async (req, res) => {
	userUtils.deleteOne(req, (err, result) => {
		res.json(result);
		return;
	})
}

const userController = { findUser, deleteUser };
export default userController;