import express from "express"
import "dotenv/config"
import cors from "cors"
import connect from "./config/database.js"
import connectCloudinary from "./config/cloudinary.js"
import { show_req } from "./middlewares/requestMiddleware.js"
import router from "../src/routes/index.js"
import session from "express-session"
import redisConnect, { redisClient } from "./config/redisConfig.js"
import RedisStore from "connect-redis"
import morgan from "morgan"
import moment from "moment"

const app = express()
const PORT = process.env.PORT || 3000

connect();
connectCloudinary();
redisConnect();

app.use(express.json())
app.use(cors({
	origin: ["http://localhost:5173"],
	credentials: true
}))
app.use(session({
	store: new RedisStore({ client: redisClient, ttl: 24 * 60 * 60 }),
	secret: 'eventmap-secret-session',
	resave: false,
	saveUninitialized: false,
	cookie: {
		name: "eventmapstatus",
		maxAge: 24 * 60 * 60 * 1000,
		httpOnly: true,
		secure: false
	}
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use((req, res, next) => {
	next();
})

app.use(router);

app.get("/", (req, res) => {
	res.json("successfully working");
})

app.listen(PORT, (req, res) => {
	console.log(`Server running at http://localhost:${PORT}`);
	// let momentobj = moment();
	// let test = momentobj.format("YYYY-MM-DD hh:mm:ss a");
	// console.log(momentobj.format("YYYY-MM-DD hh:mm:ss a"));
	// console.log(moment("2024-11-25T03:10:00.000Z").format());
	// console.log(momentobj.format());
});