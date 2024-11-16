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
							error: result,
							message: "error occured while fetching users"
						});

					}
					else {
						triggercallback(null, result);

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
			message: "error occured while fetching users"
		})
	}
}

const userUtils = { finduser };

export default userUtils;