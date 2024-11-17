import User from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/*
* @route - POST /auth/login
* @params - type,email,password
* @return - if login successfully send and store user data in session store, login is true, status is ok. if any error send error with error message.
* @desc - Login controller
*/

const login = async (req, res) => {
	const { type } = req.body;
	if (type == "google") {
		//code further;
	}
	else if (type == "normal") {
		try {
			const { email, password } = req.body;
			const tempuser = await User.find({ email });
			if (tempuser.length == 0) {
				return res.status(201).json({ status: "rejected", message: "User is not registerd" });
			}
			else if (tempuser.length == 1) {
				const password_match = await comparePassword(password, tempuser[0].password);
				if (password_match) {
					req.session.user = tempuser[0];
					req.session.login = true;
					return res.status(201).json({ status: "ok", message: "Login successfully", user: tempuser[0] })
				}
				else {
					return res.status(201).json({ status: "rejected", message: "Password is not matched" })
				}
			}
			else {
				return res.status(201).json({ status: "rejected", message: "something went wrong while password verification.Please try again", user: tempuser })
			}
		}
		catch (er) {
			return res.status(201).json({ status: "rejected", message: "something went wrong.Please try again", error: er })
		}
	}
	else {
		return res.status(201).json({ status: "rejected", message: "Invalid login type" })
	}
}

/*
* @route - POST /auth/signup
* @params - type,email,password,name
* @return - if signup successfully status is ok, send and store user data in session store , send login is true. if any error send error message
* @desc - Signup controller
*/

const signup = async (req, res) => {
	const { type } = req.body;
	if (type == "google") {
		//code further
	}
	else if (type == "normal") {
		try {
			const { email, password, name } = req.body;
			const temp = await User.find({ email });
			if (temp.length != 0) {
				return res.status(201).json({ status: "rejected", message: "User already registerd", })
			}
			else {
				const hashpassword = await hashPassword(password);
				const newUser = new User({ name, email, password: hashpassword });
				newUser.save()
					.then((user) => {
						req.session.user = newUser;
						req.session.login = true;
						return res.status(201).json({ status: "ok", message: "Account created successfully", user: newUser, sessionid: req.sessionID })
					})
					.catch((er) => {
						return res.status(201).json({ status: "rejected", message: "Failed while saving the user. Try again", error: er })

					})
			}
		}
		catch (er) {
			return res.status(201).json({ status: "rejected", error: er })
		}
	}
	else {
		return res.status(201).json({ status: "rejected", message: "invalid type" })
	}
}

/*
* @route - POST auth/logout
* @params - no params
* @return - send message "Logout successfully" if logout else send error message with some message
* @desc - Logout controller
*/

const logout = (req, res) => {
	req.session.destroy((er) => {
		if (er) {
			return res.status(400).json({ status: "rejected", message: "something went wrong while logout", error: er })
		}
		res.json({ status: "ok", message: "Logout successfully" })
	})
}

/*
* @route - POST auth/loginStatus
* @params - no params
* @return - send user data , login is true or false , sessoid is optional. if error send error with some message
* @desc - Login controller
*/

const loginStatus = (req, res) => {
	try {
		if (req?.session?.login) {
			return res.status(201).send({ status: "ok", login: true, user: req.session.user, sessionid: req.sessionID });
		}
		return res.status(201).send({ status: "ok", login: false });
	}
	catch (er) {
		return res.status(400).send({ status: "rejected", message: "error while getting login status", error: er })
	}
}

export { login, signup, logout, loginStatus };