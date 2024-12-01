import async from "async";
import { hashPassword, comparePassword } from "./password.js";
import UserOperations from "../operations/userOperations.js";

/*
* @route - POST /auth/login
* @params - type,email,password
* @return - if login successfully send and store user data in session store, login is true, status is ok. if any error send error with error message.
* @desc - Login - util
*/

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
					else if (body?.type == "normal" && body?.password) {
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
							message: "authentication type not matched or invalid details",
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

/*
* @route - POST /auth/signup
* @params - type,email,password,username or "code" for google
* @return - if signup successfully status is ok, send and store user data in session store , send login is true. if any error send error message
* @desc - Signup - util
*/

const signup = async (req, callback) => {
	const { body } = req;
	try {
		if (body?.type == "google") {
			if (body?.code) {

			}
			else {
				callback(null, {
					status: "error",
					message: "invalid details",
				});
				return;
			}
		}

		if (body.email && body?.username) {
			async.waterfall([
				function (triggercallback) {
					//checking email is present or not
					UserOperations.find({ email: body.email }, {}, (err, result) => {
						if (err) {
							triggercallback(true, { status: "error", message: "error occured" });
						}
						else {
							if (result.length != 0) {
								triggercallback(true, {
									status: "error",
									message: "email already registered",
								})
							}
							else {
								triggercallback(null, result);
							}
						}
					})
				},
				function (data, triggercallback) {
					//checking username is present or not.
					UserOperations.find({ username: body.username }, {}, (err, result) => {
						if (err) {
							triggercallback(true, { status: "error", message: "error occured", error: result });
						}
						else {
							if (result.length != 0) {
								triggercallback(true, {
									status: "error",
									message: "username already present",
								})
							}
							else {
								triggercallback(null, data);
							}
						}
					})
				},
				function (data, triggercallback) {
					if (body?.type == "google") {

					}
					else if (body?.type == "normal" && body?.password) {
						let hashedpassword = hashPassword(body.password);
						let userInfo = { email: body.email, password: hashedpassword, username: body.username, name: body.username };
						/* console.log(userInfo); */
						UserOperations.insertMany(userInfo, (err, result) => {
							if (err) {
								triggercallback(true, {
									status: "error",
									error: result,
									message: "error while registering"
								})
							}
							else {
								req.session.login = true;
								req.session.user = result;
								triggercallback(null, {
									status: "ok",
									message: "signup successfully",
									user: result,
								})
							}
						})
					}
					else {
						triggercallback(true, {
							status: "error",
							message: "authentication type not found or invalid details."
						})
					}
				}
			],
				function (err, result) {
					callback(err, result);
					return;
				}
			)
		}
		else {
			callback(true, { status: "error", message: "invalid details" });
			return;
		}
	}
	catch (err) {
		callback(true, {
			status: "error",
			error: err,
			message: "error occured",
		});
		return;
	}

}

/*
* @route - POST auth/logout
* @params - no params
* @return - send message "Logout successfully" if logout else send error message with some message
* @desc - Logout - util
*/

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

/*
* @route - POST auth/loginStatus
* @params - no params
* @return - send user data , login is true or false , sessonid is optional. if error send error with some message
* @desc - LoginStatus - util
*/

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
