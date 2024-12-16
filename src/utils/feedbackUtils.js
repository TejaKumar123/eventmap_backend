import feedbackOperations from "../operations/feedbackOperations.js";
import moment from "moment";
import async from "async";
import { ObjectId } from "mongodb";
import sessionOperations from "../operations/sessionOperations.js";
import UserOperations from "../operations/userOperations.js";

/* 
* @route - POST feedback/feedback_add
* @params - email,session_id,feedback
* @desc - feedback - util - insertMany
*/

const insertMany = async (req, callback) => {
	let { body } = req;

	let feedbackObj = {
		_id: "",
		feedback_id: "",
		email: "",
		session_id: "",
		feedback: "",
		date_time: ""
	}

	if (body && body.email && body.session_id && body.feedback) {
		let objectid = new ObjectId();
		let momentobj = moment();
		Object.assign(feedbackObj, body);
		feedbackObj._id = objectid;
		feedbackObj.feedback_id = objectid;
		feedbackObj.date_time = momentobj.format();
		async.waterfall([
			function (triggercallback) {
				sessionOperations.find({ session_id: feedbackObj.session_id }, {}, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: "session not found",
						})
					}
					else {
						if (result.length == 1) {
							triggercallback(null, result)
						}
						else {
							triggercallback(true, {
								status: "error",
								message: "session not found",
							})
						}
					}
				})
			},
			function (data, triggercallback) {
				feedbackOperations.insertMany(feedbackObj, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while adding feedbacks"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
							message: "feedback given successfully"
						})
					}
				})
			}
		],
			function (err, result) {
				callback(err, result);
			}
		)

	}
	else {
		callback(true, {
			status: "error",
			message: "error while adding a feedback",
		})
	}

}

/* 
* @route - POST feedback/feedback_update
* @params - criteria,updatedInfo as objects. But present using feedback and feedback_id
* @desc - feedback - util - updateMany
*/

const updateMany = async (req, callback) => {
	let { body } = req;

	if (body && body.feedback_id && body.feedback) {
		let criteria = { feedback_id: body.feedback_id };
		let updatedInfo = { feedback: body.feedback };

		async.waterfall([
			function (triggercallback) {
				feedbackOperations.updateMany(criteria, updatedInfo, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while updating feedbacks"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
							message: "feedback updated successfully"
						})
					}
				})
			}
		],
			function (err, result) {
				callback(err, result);
			}
		)
	}
	else {
		callback(true, {
			status: "error",
			message: "error while updating the data",
		})
	}
}

/* 
* @route - POST feedback/feedback_delete
* @params - feedback_id
* @desc - feedback - util - deleteMany
*/

const deleteMany = async (req, callback) => {
	let { body } = req;

	if (body && body.feedback_id) {
		let criteria = { feedback_id: body.feedback_id };
		async.waterfall([
			function (triggercallback) {
				feedbackOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while deleting feedbacks"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
							message: "feedbacks deleted successfully"
						})
					}
				})
			}
		],
			function (err, result) {
				callback(err, result);
			}
		)
	}
	else {
		callback(true, {
			status: "error",
			message: "error ocuured while deleting the feedback",
		})
	}
}

/* 
* @route - POST feedback/feedback_update
* @params - criteria, projection as objects
* @desc - feedback - util - feedback_view
*/

const find = async (req, callback) => {
	let { body } = req;

	if (body) {
		let criteria = body.criteria || {};
		let projection = body.projection || {};
		async.waterfall([
			function (triggercallback) {
				feedbackOperations.find(criteria, projection, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while fetching feedbacks"
						})
					}
					else {
						triggercallback(null, result);
					}
				})
			},
			function (data, triggercallback) {
				let finalData = data.map((value) => {
					let tempData = JSON.parse(JSON.stringify(value));
					let getAllData = async (updatedData) => {
						return new Promise((resolve, reject) => {
							async.waterfall([
								function (nestedCallback) {
									let criteria = { email: updatedData?.email };
									let projection = { username: true, email: true, name: true, profileimage: true };
									UserOperations.find(criteria, projection, (err, result) => {
										if (err) {
											nestedCallback(true, {});
										}
										else {
											updatedData["creator"] = result[0];
											nestedCallback(null, updatedData);
										}
									})
								},
								function (data, nestedCallback) {
									let criteria = { session_id: updatedData?.session_id };
									let projection = { session_name: true, session_description: true, createdAt: true, date_time: true };
									sessionOperations.find(criteria, projection, (err, result) => {
										if (err) {
											nestedCallback(true, {});
										}
										else {
											data["session"] = result[0];
											nestedCallback(null, data);
										}
									})
								}
							],
								function (err, result) {
									if (err) {
										reject();
									}
									else {
										resolve(result);
									}
								}
							)
						})
					}
					return getAllData(tempData);
				});

				Promise.allSettled(finalData)
					.then((result) => {
						triggercallback(null, {
							status: "ok",
							data: result,
							message: "feedbacks fetched successfully",
						});
					})
					.catch((err) => {
						triggercallback(true, {
							status: "error",
							message: "error while fetching feedback data",
						})
					})
			}
		],
			function (err, result) {
				callback(err, result);
			}
		)
	}
	else {
		callback(true, {
			status: "error",
			message: "error while fetching data",
		})
	}
}

const feedbackUtils = { insertMany, updateMany, deleteMany, find };

export default feedbackUtils;
