import User from "../models/user.js";
import AuthenticationUtil from "../utils/authenticationUtil.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/*
* @route - POST /auth/login
* @params - type,email,password
* @return - if login successfully send and store user data in session store, login is true, status is ok. if any error send error with error message.
* @desc - Login controller
*/

const login = async (req, res) => {
	AuthenticationUtil.login(req, (err, result) => {
		return res.json(result);
	});
}

/*
* @route - POST /auth/signup
* @params - type,email,password,name
* @return - if signup successfully status is ok, send and store user data in session store , send login is true. if any error send error message
* @desc - Signup controller
*/

const signup = async (req, res) => {
	AuthenticationUtil.signup(req, (err, result) => {
		return res.json(result);
	})
	/* const { type } = req.body;
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
	} */
}

/*
* @route - POST auth/logout
* @params - no params
* @return - send message "Logout successfully" if logout else send error message with some message
* @desc - Logout controller
*/

const logout = (req, res) => {
	AuthenticationUtil.logout(req, (err, result) => {
		res.json(result);
	})
}

/*
* @route - POST auth/loginStatus
* @params - no params
* @return - send user data , login is true or false , sessonid is optional. if error send error with some message
* @desc - Login controller
*/

const loginStatus = (req, res) => {
	AuthenticationUtil.loginStatus(req, (err, result) => {
		res.json(result);
	})
}

const authController = { login, signup, logout, loginStatus };
export default authController;