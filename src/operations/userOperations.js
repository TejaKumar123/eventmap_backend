import User from "../models/user.js";

const find = async (criteria, projection, callback) => {
	try {
		let res = await User.find(criteria, projection);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}

const UserOperations = { find };

export default UserOperations;