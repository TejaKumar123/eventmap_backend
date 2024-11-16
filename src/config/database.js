import mongoose from "mongoose"

const connect = async () => {
	mongoose.connect(process.env.MONGODB_URI);

	const db = mongoose.connection;

	db.on("connected", () => console.log("mongodb connected"));

	db.on("disconnected", () => {
		console.log("mongodb disconnected");
		setTimeout(() => {
			mongoose.connect(process.env.MONGODB_URI)
				.then(() => {
					console.log("mongodb connected after disconnected.")
				})
				.catch(() => {
					console.log("error occured while reconnecting");
				})
		}, 5000);
	});

	db.on("reconnected", () => console.log("mongodb reconnected"));

	db.on("error", () => console.log("error occured while connecting to mongodb"));

}

export default connect;