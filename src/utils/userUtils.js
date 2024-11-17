import UserOperations from "../operations/userOperations.js";
import async from "async";

const finduser = async (req, callback) => {
	let { body } = req;
	let criteria = {};
	if (body && body.role) {
		criteria.role = body.role;
		async.waterfall([
			function (triggercallback) {
				UserOperations.find(criteria, (err, result) => {
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

const userUtils = { finduser };

export default userUtils;