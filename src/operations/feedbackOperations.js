import Feedback from "../models/feedback.js";

const insertMany = async (data, callback) => {
	try {
		let res = await Feedback.insertMany([data]);
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
		let res = await Feedback.updateMany(criteria, updatedInfo);
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
		let res = await Feedback.deleteMany(criteria);
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
		let res = await Feedback.find(criteria, projection);
		callback(null, res);
		return;
	}
	catch (err) {
		callback(true, err);
		return;
	}
}



const feedbackOperations = { insertMany, updateMany, deleteMany, find };

export default feedbackOperations;