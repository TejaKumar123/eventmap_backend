import UserOperations from "../operations/userOperations.js";
import async from "async";

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
						triggercallback(null, {
							status: "ok",
							data: result
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
			message: "error occured while fetching users"
		})
	}
}

const deleteOne = async (req, callback) => {
	const { body } = req;
	if (body && body.email) {
		let criteria = { email: body.email };
		async.waterfall([
			UserOperations.deleteMany(criteria, (err, result) => {
				if (err) {
					callback(true, {
						status: "error",
						error: result,
						message: "error in removing the user"
					})
				}
				else {
					callback(null, {
						status: "ok",
						message: "successfully removed the user",
						data: result,
					})
				}
			})
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

const userUtils = { find, deleteOne };

export default userUtils;