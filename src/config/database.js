import mongoose from "mongoose"

const connect = async () => {
	mongoose.connect(process.env.MONGODB_URI)
		.then(() => {
			console.log("database connected successfully");
		})
		.catch((er) => {
			console.log("error", er);
		})
}

export default connect;