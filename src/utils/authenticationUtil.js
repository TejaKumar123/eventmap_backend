import async from "async";
import { hashPassword, comparePassword } from "./password.js";
import UserOperations from "../operations/userOperations.js";
import oauth2Client from "../config/googleConfig.js";
import { google } from "googleapis";
/* import { Readable } from "stream"; */

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
				status: "error",
				message: "already one account login",
			})
			return;
		}

		if (body?.type == "google") {
			if (body?.code) {
				let { tokens } = await oauth2Client.getToken(body.code);
				/* console.log(tokens); */
				oauth2Client.setCredentials(tokens);
				let userInfo = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });
				body.email = userInfo.data.email;

				///testing drive start
				/* let drive = google.drive({ version: "v3", auth: oauth2Client })

				try {
					// File metadata
					const fileMetadata = {
						name: `random-file-${Date.now()}.txt`, // Randomized file name
						mimeType: 'text/plain',
					};
					// Generate random content and convert it into a readable stream
					const randomContent = `This is a random file created at ${new Date().toISOString()}`;
					const readableStream = Readable.from(randomContent); // Convert string to stream
					const media = {
						mimeType: 'text/plain',
						body: readableStream, // Pass the readable stream here
					};

					const response1 = await drive.files.create({
						requestBody: fileMetadata,
						media: media,
						fields: 'id', // Get the file ID in the response
					});
					console.log({ response1: response1?.data?.id });

					let response = await drive.files.list();
					console.log({ response: JSON.stringify(response.data.files) });

				}
				catch (err) {
					console.log({ error: err });
				} */


				///testing drive end

			}
			else {
				callback(true, { status: "error", message: "invalid details." });
				return;
			}
		}

		if (body.email && body.type) {
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

		if (req?.session?.login == true) {
			callback(true, {
				status: "error",
				message: "already one account logined"
			});
			return;
		}

		if (body?.type == "google") {
			if (body?.code) {
				let { tokens } = await oauth2Client.getToken(body.code);
				oauth2Client.setCredentials(tokens);
				let userInfo = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });
				body.email = userInfo.data.email;
				body.username = userInfo?.data?.name + userInfo.data.id;
				body.userInfo = userInfo.data;
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
						let userInfo = {
							name: body.userInfo.name,
							email: body.userInfo.email,
							type: "google",
							username: body.username,
							profileimage: body.userInfo.picture,
						}

						UserOperations.insertMany([userInfo], (err, result) => {
							if (err) {
								triggercallback(true, {
									status: "error",
									message: "error while signup",
									error: result,
								})
							}
							else {
								req.session.login = true;
								req.session.user = result[0];
								triggercallback(null, {
									status: "ok",
									message: "signup successfully with google",
									user: result[0],
								});
							}
						})

					}
					else if (body?.type == "normal" && body?.password) {
						let hashedpassword = hashPassword(body.password);
						let userInfo = { email: body.email, password: hashedpassword, username: body.username, name: body.username };
						/* console.log(userInfo); */
						UserOperations.insertMany([userInfo], (err, result) => {
							if (err) {
								triggercallback(true, {
									status: "error",
									error: result,
									message: "error while registering"
								})
							}
							else {
								req.session.login = true;
								req.session.user = result[0];
								triggercallback(null, {
									status: "ok",
									message: "signup successfully",
									user: result[0],
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
			message: "error occured.",
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
