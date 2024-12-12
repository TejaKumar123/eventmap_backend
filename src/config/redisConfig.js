import { createClient } from "redis";

/* const redisClient = createClient({
	host: "localhost",
	port: "6379"
}) */

const redisClient = createClient({
	username: 'default',
	password: `${process.env.REDIS_PASSWORD}`,
	socket: {
		host: `${process.env.REDIS_HOST}`,
		port: `${process.env.REDIS_PORT}`
	}
});

const redisConnect = async () => {
	redisClient.connect()
		.then(() => {
			console.log("Redis connected");
		})
		.catch((er) => {
			console.log({ error: er })
		})
}

export default redisConnect;
export { redisClient };