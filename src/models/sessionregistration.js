import { Schema, model } from "mongoose";

const registrationSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	session_id: {
		type: String,
		required: true,
	},
	date_time: {
		type: Date,
		required: true,
	},
})

const Registration = model("Registration", registrationSchema);

export default Registration;