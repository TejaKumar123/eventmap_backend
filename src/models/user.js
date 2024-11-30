import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		minlength: 8,
	},
	username: {
		type: String,
		required: true,
	},
	//password is hashed password using bcrypt
	role: {
		type: String,
		required: true,
		default: "participant",
	},
	//role values are admin,participant,speaker
	type: {
		type: String,
		default: "normal"
	},
	//types are google, normal
	profileimage: {
		type: String,
		default: null,
	},
	dateOfBirth: {
		type: Date,
		default: null,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,
});

userSchema.pre('save', function (next) {
	if (!this.isNew) {
		this.updatedAt = Date.now();
	}
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
