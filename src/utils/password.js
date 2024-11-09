import bcrypt from "bcryptjs";

const hashPassword = async (plainpassword) => {
	const saltrounds = 10;
	const finalhash = await bcrypt.hash(plainpassword, saltrounds);
	return finalhash;
}

const comparePassword = async (plainpassword, hashpassword) => {
	const isMatch = await bcrypt.compare(plainpassword, hashpassword)
	return isMatch;
}

export { hashPassword, comparePassword };