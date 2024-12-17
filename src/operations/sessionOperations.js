import Session from "../models/session.js";

const insertOne = async (data, callback) => {
	try {
		let res = await Session.insertMany([data]);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
	}
}

const updateOne = async (criteria, updateInfo, callback) => {
	try {
		let res = await Session.updateOne(criteria, updateInfo);
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
		let res = await Session.find(criteria, projection);
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
		let res = await Session.deleteOne(criteria);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
	}
}

const sessionOperations = { insertOne, updateOne, find, deleteMany };

export default sessionOperations;
