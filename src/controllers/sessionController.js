import sessionUtils from "../utils/sessionUtils.js";

/* 
* @Route - POST /session/session_add
* @params - req,callback, req include session_name,session_description,date_time,venue
*/

const session_add = (req, res) => {
	sessionUtils.insertOne(req, (err, result) => {
		res.json(result);
		return;
	})
}

/* 
* @Route - POST /session/session_update
* @params - criteria, updatedInfo as objects
*/

const session_update = (req, res) => {
	sessionUtils.updateOne(req, (err, result) => {
		res.json(result);
	})
}

/* 
* @Route - POST /session/session_delete
* @params - session_id
*/

const session_delete = (req, res) => {
	sessionUtils.deleteMany(req, (err, result) => {
		res.json(result);
	})
}

/* 
* @Route - POST /session/session_view
* @params - criteria, projection as objects
*/

const session_view = (req, res) => {
	sessionUtils.find(req, (err, result) => {
		res.json(result);
	})
}

export { session_add, session_update, session_delete, session_view };