import { Schema, model } from "mongoose";

const registrationSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	registration_id: {
		type: "String",
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	// email from user model only
	session_id: {
		type: String,
		required: true,
	},
	//session_id from from session model only
	date_time: {
		type: Date,
		required: true,
	},
})

const Registration = model("Registration", registrationSchema);

export default Registration;
