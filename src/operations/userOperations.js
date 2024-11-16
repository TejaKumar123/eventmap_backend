import User from "../models/user.js";

const find = async (criteria, callback) => {
	try {
		let res = await User.find(criteria);
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