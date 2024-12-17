import moment from "moment";
import { ObjectId } from "mongodb";
import sessionOperations from "../operations/sessionOperations.js";
import async from "async";
import UserOperations from "../operations/userOperations.js";


/* 
* @params req,callback, req include session_name,session_description,date_time,venue
*/

const insertOne = async (req, callback) => {
	let { body } = req;

	let sessionObj = {
		session_id: "",
		_id: "",
		email: "",
		session_name: "",
		session_description: "",
		date_time: "",
		status: "",
		session_image: "",
		created_on: "",
		venue: "",
		acceptance: "",
		updated_at: ""
	}

	if (body && body.email && body.session_name && body.session_description && body.date_time && body.venue) {
		let objectid = new ObjectId()
		let momentobj = moment();
		Object.assign(sessionObj, body);
		sessionObj.session_id = objectid.toHexString();
		sessionObj._id = objectid;
		sessionObj.date_time = moment(body.date_time).toDate()
		sessionObj.status = 0;
		sessionObj.session_image = "https://picsum.photos/id/2/300/200";
		sessionObj.created_on = momentobj.format();
		sessionObj.acceptance = "pending";
		sessionObj.updated_at = momentobj.format();
		async.waterfall([
			function (triggercallback) {
				sessionOperations.insertOne(sessionObj, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while adding session"
						});
					}
					else {
						triggercallback(err, {
							status: "ok",
							data: result[0],
							message: "session successfully added"
						});
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
			message: "error while adding session",
		})
	}
}

/* 
 @params - it will get criteria attributes like email,acceptance,session_name
*/

const find = async (req, callback) => {
	const { body } = req;

	if (body) {
		let criteria = body.criteria || {};
		let projection = body.projection || {};

		//criterias

		async.waterfall([
			function (triggercallback) {
				sessionOperations.find(criteria, projection, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error occured while fetching sessions"
						});
					}
					else {
						triggercallback(null, result);
					}
				})
			},
			function (data, triggercallback) {
				let tempResult = data.map((value) => {
					let temp = JSON.parse(JSON.stringify(value));
					let criteria = { email: temp.email };
					let projection = { _id: true, email: true, username: true, name: true };
					const getUser = async (criteria, projection) => {
						return new Promise((resolve, reject) => {
							/* console.log(criteria); */
							UserOperations.find(criteria, projection, (err, userData) => {
								if (err) {
									reject({
										status: "error",
										message: "error getting details",
									})
								}
								else {
									temp["creator"] = userData[0];
									resolve(temp);
								}
							})
						})
					}
					return getUser(criteria, projection);
				});
				/* console.log(tempResult) */
				Promise.allSettled(tempResult)
					.then((result) => {
						/* console.log(result); */
						triggercallback(null, {
							status: "ok",
							message: "sessions fetched successfully",
							data: result,
						});
					});

			}
		],
			function (err, result) {
				callback(err, result);
			}
		)
	}
	else {
		callback(true, {
			message: "error occured while find the sessions"
		})
	}
}

const updateOne = async (req, callback) => {
	const { body } = req;

	if (body && Object.keys(body.criteria).length && body.updatedInfo) {
		async.waterfall([
			function (triggercallback) {
				sessionOperations.updateOne(body.criteria, body.updatedInfo, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error while updating"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
							message: "successfully updated"
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
			message: "error ocuured while updating session",
		})
	}
}

const deleteMany = async (req, callback) => {
	const { body } = req;

	if (body && Object.keys(body.criteria).length != 0) {
		let criteria = body.criteria;
		async.waterfall([
			function (triggercallback) {
				sessionOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error while deleting session"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
							session: "successfully deleted",
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
			message: "Please provode the session_id",
			status: "error"
		})
	}
}

const sessionUtils = { insertOne, find, updateOne, deleteMany };

export default sessionUtils;
