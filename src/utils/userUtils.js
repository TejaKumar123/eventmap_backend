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

const userUtils = { find };

export default userUtils;