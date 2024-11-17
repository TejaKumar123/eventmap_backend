import feedbackUtils from "../utils/feedbackUtils.js";

/* 
* @route - POST feedback/feedback_add
* @params - email,session_id,feedback
* @desc - feedback - controller - feedback_add
*/

const feedback_add = async (req, res) => {
	feedbackUtils.insertMany(req, (err, result) => {
		res.json(result);
		return;
	})
}

/* 
* @route - POST feedback/feedback_update
* @params - criteria,updatedInfo as objects
* @desc - feedback - controller - feedback_update
*/

const feedback_update = async (req, res) => {
	feedbackUtils.updateMany(req, (err, result) => {
		res.json(result);
		return;
	})
}

/* 
* @route - POST feedback/feedback_update
* @params - feedback_id
* @desc - feedback - controller - feedback_delete
*/

const feedback_delete = async (req, res) => {
	feedbackUtils.deleteMany(req, (err, result) => {
		res.json(result);
		return;
	})
}

/* 
* @route - POST feedback/feedback_update
* @params - criteria,projection as objects
* @desc - feedback - controller - feedback_view
*/

const feedback_view = async (req, res) => {
	feedbackUtils.find(req, (err, result) => {
		res.json(result);
		return;
	})
}

const feedbackController = { feedback_add, feedback_update, feedback_delete, feedback_view };

export default feedbackController;