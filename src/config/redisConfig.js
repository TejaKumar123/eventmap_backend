import { createClient } from "redis";

const redisClient = createClient({
	host: "localhost",
	port: "6379"
})

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