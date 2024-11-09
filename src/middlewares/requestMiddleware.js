
const show_body = (req, res, next) => {
	console.log({ body: req.body });
	next();
}

const show_query = (req, res, next) => {
	console.log({ query: req.query });
	next();
}

const show_params = (req, res, next) => {
	console.log({ params: req.params });
	next();
}

const show_req = (req, res, next) => {
	console.log({ req: req });
	next();
}

const show_headers = (req, res, next) => {
	console.log({ headers: req.headers });
	next();
}

const show_session = (req, res, next) => {
	console.log(req.session);
	next();
}

export { show_body, show_params, show_query, show_req, show_headers, show_session };