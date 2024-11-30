import async from "async";
import { hashPassword, comparePassword } from "./password.js";
import UserOperations from "../operations/userOperations.js";

const login = async (req, callback) => {
	const { body } = req;

	try {

		if (req.session.login == true) {
			callback(null, {
				status: "ok",
				message: "already one account login",
			})
			return;
		}

		if (body?.type == "google") {
			if (body?.code) {

			}
			else {
				callback(true, { status: "error", message: "invalid details." });
				return;
			}
		}

		if (body.email && body.password && body.type) {
			async.waterfall([
				function (triggercallback) {
					let criteria = { email: body.email, type: body.type };
					let projection = {};
					UserOperations.find(criteria, projection, (err, result) => {
						if (err) {
							triggercallback(true, {
								status: "error",
								error: result,
								message: "error while login",
							})
						}
						else {
							if (result.length == 1) {
								triggercallback(null, result[0]);
							}
							else {
								triggercallback(true, {
									status: "error",
									message: "user not found",
								})
							}
						}
					})
				},
				function (data, triggercallback) {
					if (body?.type == "google") {
						req.session.login = true;
						req.session.user = data;
						triggercallback(null, {
							status: "ok",
							message: "user login successfully",
							user: data,
						})
					}
					else if (body?.type == "normal") {
						let flag = comparePassword(body?.password, data?.password);
						if (flag) {
							req.session.login = true;
							req.session.user = data; //setting the user data into session if password matched
							triggercallback(null, {
								status: "ok",
								message: "user login successfully",
								user: data,
							})
						}
						else {
							triggercallback(true, {
								status: "error",
								message: "password not matched",
							})
						}
					}
					else {
						triggercallback(true, {
							status: "error",
							message: "authentication type not matched",
						})
					}
				}
			],
				function (err, result) {
					callback(err, result);
					return;
				})

		}
		else {
			callback(true, {
				status: "error",
				message: "invalid details",
			})
			return;
		}
	}
	catch (err) {
		callback(true, {
			status: "error",
			error: err,
			messsage: "error occured",
		})
		return;
	}

}

const signup = async (req, callback) => {

}

const logout = async (req, callback) => {
	try {
		req.session.destroy((err) => {
			if (err) {
				callback(true, {
					status: "error",
					error: err,
					message: "error while logout"
				})
			}
			else {
				callback(null, {
					status: "ok",
					message: "logout successfully",
				})
			}
		});
	}
	catch (err) {
		callback(true, {
			status: "error",
			error: err,
			message: "error while logout."
		})
	}
}

const loginStatus = async (req, callback) => {
	try {
		if (req?.session?.login == true) {
			callback(null, {
				status: "ok",
				login: true,
				user: req.session.user,
			})
		}
		else {
			callback(null, {
				status: "ok",
				login: false,
			})
		}
	}
	catch (err) {
		callback(true, {
			status: "error",
			message: "error while fetching login status",
			error: err,
		})
		return;
	}

}

const AuthenticationUtil = { login, signup, logout, loginStatus };

export default AuthenticationUtil;
