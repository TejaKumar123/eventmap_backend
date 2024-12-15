import { ObjectId } from "mongodb";
import registrationOperations from "../operations/registrationOperations.js";
import moment from "moment";
import sessionOperations from "../operations/sessionOperations.js";
import async from "async";

/* 
* @Route - POST /registration/registration_add
* @params - email, session_id
* @decs - Util - insertMany
*/

const insertMany = async (req, callback) => {
	const { body } = req;

	let registrationObj = {
		_id: "",
		registration_id: "",
		email: "",
		session_id: "",
		date_time: "",
	}

	if (body && body.session_id && body.email) {
		let objectid = new ObjectId()
		let momentobj = moment();
		Object.assign(registrationObj, body);
		registrationObj._id = objectid;
		registrationObj.registration_id = objectid;
		registrationObj.date_time = momentobj.format();
		async.waterfall([
			function (triggercallback) {
				sessionOperations.find({ session_id: registrationObj.session_id }, {}, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: err
						});
					}
					else {
						if (result.length == 1) {
							triggercallback(null, result);
						}
						else {
							triggercallback(true, {
								status: "error",
								message: "session not found to register",
							});
						}
					}
				})
			},
			function (data, triggercallback) {
				/* console.log(registrationObj); */
				registrationOperations.insertMany(registrationObj, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: result,
						});
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result[0]
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
			message: "error while registering to the session.",
		})
	}


}

/* 
* @Route - POST /registration/registration_delete
* @params - registration_id
* @decs - Util - deleteMany
*/

const deleteMany = async (req, callback) => {
	const { body } = req;

	if (body && body.registration_id) {
		let criteria = { registration_id: body.registration_id, ...body?.criteria };

		async.waterfall([
			function (triggercallback) {
				registrationOperations.deleteMany(criteria, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: err,
						})
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
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
			message: "error while deleting",
		})
	}
}

/* 
* @Route - POST /registration/registration_view
* @params - criteria,projection as objects
* @decs - Util - find
*/

const find = async (req, callback) => {
	const { body } = req;

	/* console.log("registration - find - util") */

	if (body) {
		let criteria = body.criteria || {};
		let projection = body.projection || {};

		async.waterfall([
			function (triggercallback) {
				registrationOperations.find(criteria, projection, (err, result) => {
					if (err) {
						triggercallback(true, {
							status: "error",
							error: err,
						});
					}
					else {
						triggercallback(null, {
							status: "ok",
							data: result,
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
			status: "error",
			message: "error while fetching the registration",
		});
	}
}

const registrationUtils = { insertMany, deleteMany, find };

export default registrationUtils;