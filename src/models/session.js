import mongoose, { model } from "mongoose";
import { Schema, Model } from "mongoose";

const sessionSchema = new Schema({
	session_id: {
		type: String,
		required: true
	},
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	email: {
		type: Schema.Types.String,
		required: true,
	},
	session_name: {
		type: String,
		required: true,
	},
	session_description: {
		type: String,
		required: true,
	},
	date_time: {
		type: Date,
		required: true,
	},
	status: {
		type: Number,
		required: true,
	},
	session_image: {
		type: String,
		required: true,
		default: "https://picsum.photos/id/2/300/200"
	},
	created_on: {
		type: Date,
		required: true,
	},
	venue: {
		type: String,
		required: true,
	},
	acceptance: {
		type: String,
		required: true,
	},
	updated_at: {
		type: Date,
		required: true,
	}
})

const Session = model("Session", sessionSchema);

export default Session;

