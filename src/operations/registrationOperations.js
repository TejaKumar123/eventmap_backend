import Registration from "../models/registration.js";

const insertMany = async (data, callback) => {
	try {
		let res = await Registration.insertMany([data]);
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
		let res = await Registration.deleteMany(criteria);
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
		let res = await Registration.find(criteria, projection);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}

const registrationOperations = { insertMany, deleteMany, find };

export default registrationOperations;