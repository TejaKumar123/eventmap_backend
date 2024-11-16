import oauth2Client from "../config/googleConfig.js";
import { google } from "googleapis";
import axios from "axios"

const googleoauth = async (req, res, next) => {
	const { type } = req.body;
	if (type == "normal") {
		next();
	}
	else if (type == "google") {
		try {
			/* const { code } = req.body;
			console.log(code);
			const { tokens } = await oauth2Client.getToken(code);
			oauth2Client.setCredentials(tokens);

			const userProfile = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
			const userinfo = userProfile.data;
			console.log(userinfo);
			req.body = { ...req.body, ...userinfo, ...tokens }; */
			next()
		}
		catch (er) {
			return res.json({ error: er });
		}
	}
	else {
		return res.json({ error: "something went wrong", body: req.body });
	}
}

export { googleoauth };