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
	}
	catch (err) {
		callback(true, {
			message: "error while updatating the session"
		});
		return;
	}
}

const find = async (criteria, projection, callback) => {
	try {
		let res = await Session.find(criteria, projection);
		callback(null, res);
	}
	catch (err) {
		callback(true, {
			message: "error occured while fetching data"
		});
		return;
	}
}

const deleteOne = async (criteria, callback) => {
	try {
		let res = await Session.deleteOne(criteria);
		callback(null, res);
	}
	catch (err) {
		callback(true, {
			message: "error while deleting the session"
		});
	}
}

const sessionOperations = { insertOne, updateOne, find, deleteOne };

export default sessionOperations;
