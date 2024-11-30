

const login = async (req, callback) => {
	const { body } = req;
	if (body.email && body.password && body.type) {

		if (body.type == "google") {
			if (body.code) {

			}
			else {
				callback(true, { status: "error", message: "invalid details" })
			}
		}




	}
	else {
		callback(true, {
			status: "error",
			message: "invalid details",
		})
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
