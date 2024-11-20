import { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	feedback_id: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
	},
	//email from user model only
	feedback: {
		type: String,
		required: true,
	},
	session_id: {
		type: String,
		required: true,
	},
	// session_id from session model only
	date_time: {
		type: Date,
		required: true,
	}
})

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;
