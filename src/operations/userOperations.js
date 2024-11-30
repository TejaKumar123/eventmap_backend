import User from "../models/user.js";

const insertMany = async (data, callback) => {
	try {
		let res = await User.insertMany(data);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}

const updateMany = async (criteria, updatedInfo, callback) => {
	try {
		let res = await User.updateMany(criteria, updatedInfo);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}

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

const deleteMany = async (criteria, callback) => {
	try {
		let res = await User.deleteMany(criteria);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}

const UserOperations = { insertMany, updateMany, deleteMany, find };

export default UserOperations;