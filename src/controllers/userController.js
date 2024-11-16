import userUtils from "../utils/userUtils.js";


const findUser = async (req, res) => {
	userUtils.finduser(req, (err, result) => {
		res.json(result);
		return;
	})
}

export { findUser };