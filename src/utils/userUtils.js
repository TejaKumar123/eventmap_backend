import feedbackOperations from "../operations/feedbackOperations.js";
import registrationOperations from "../operations/registrationOperations.js";
import sessionOperations from "../operations/sessionOperations.js";
import UserOperations from "../operations/userOperations.js";
import async from "async";
import sessionUtils from "./sessionUtils.js";

/* 
* @route - /user/findUser
* @params - criteria, projection as objects
* @desc - user - util - find
*/

const find = async (req, callback) => {
	let { body } = req;

	if (body && body.criteria) {

		let criteria = body.criteria || {};
		let projection = body.projection || {};

		async.waterfall([
			function (triggercallback) {
				UserOperations.find(criteria, projection, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
						});

					}
					else {
						triggercallback(null, result);

					}
				})
			},
			function (data, triggercallback) {
				try {
					let updatedData = data.map((value) => {
						let tempData = JSON.parse(JSON.stringify(value));
						let criteria = { email: value.email };
						let projection = { _id: true };
						let fetchCount = async (criteria, projection) => {
							return new Promise((resolve, reject) => {
								async.waterfall([
									function (nestedcallback) {
										sessionOperations.find(criteria, projection, (err, result) => {
											if (err) {
												nestedcallback(true, { error: err });
											}
											else {
												tempData["sessionCount"] = result.length;
												nestedcallback(null, tempData);
											}
										})
									},
									function (data, nestedcallback) {
										registrationOperations.find(criteria, projection, (err, result) => {
											if (err) {
												nestedcallback(true, { error: err });
											}
											else {
												data["registerCount"] = result.length;
												nestedcallback(null, data);
											}
										})
									}
								],
									function (err, result) {
										if (err) {
											reject(result);
										}
										else {
											resolve(result);
										}
									}
								)



							})
						}
						return fetchCount(criteria, projection);
					})
					Promise.allSettled(updatedData)
						.then((result) => {
							triggercallback(null, {
								status: "ok",
								data: result,
								message: "user fetched successfully"
							})
						})
						.catch((err) => {
							triggercallback(true, {
								status: "error",
								error: err,
								message: "error while fetched successfully"
							})
						})
				}
				catch (err) {
					triggercallback(true, {
						status: "error",
						error: err,
					})
				}
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
			message: "error occured while fetching users"
		})
	}
}

const deleteMany = async (req, callback) => {
	const { body } = req;
	if (body && Object.keys(body.criteria).length != 0 && body.criteria.email) {
		let criteria = body.criteria;
		async.waterfall([
			function (triggercallback) {
				let emailCriteria = criteria;
				let projection = { _id: true, session_id: true, email: true };
				/* console.log({ emailCriteria, projection }); */
				sessionOperations.find(emailCriteria, projection, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							message: "error occur while removing user sessions. Please try again"
						})
					}
					else {
						triggercallback(true, result);
					}
				})
			},
			function (data, triggercallback) {
				let finalData = data.map((value) => {
					let tempData = JSON.parse(JSON.stringify(value));
					let deleteSession = async (tempData) => {
						return new Promise((resolve, reject) => {
							let criteria = { session_id: tempData.session_id };
							console.log({ criteria: criteria });
							/* sessionUtils.deleteMany(criteria, (err, result) => {
								if (err) {
									resolve("ok");
								}
								else {
									reject("error");
								}
							}) */
						})
					}
					return deleteSession(tempData);
				});
				Promise.allSettled(finalData)
					.then((res) => {
						triggercallback(null, {});
					})
					.catch((err) => {
						triggercallback(true, {
							status: "error",
							message: "error while removing user sessions",
						})
					})
			},
			function (data, triggercallback) {
				registrationOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							message: "error occur while removing user registrations. Please try again"
						})
					}
					else {
						triggercallback(null, {});
					}
				})
			},
			function (data, triggercallback) {
				feedbackOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							message: "error occur while removing user feedbacks. Please try again"
						})
					}
					else {
						triggercallback(null, {});
					}
				})
			},
			function (data, triggercallback) {
				UserOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
							message: "error in removing the user"
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							message: "successfully removed the user",
							data: result,
						})
					}
				})
			}
		],
			function (err, result) {
				callback(err, result);
				return;
			}
		)
	}
	else {
		callback(true, {
			status: "error",
			message: "error while removing the user",
		})
		return;
	}
}

const userUtils = { find, deleteMany };

export default userUtils;