import bcrypt from "bcryptjs";

const hashPassword = (plainpassword) => {
	const saltrounds = 10;
	const finalhash = bcrypt.hashSync(plainpassword, saltrounds);
	return finalhash;
}

const comparePassword = (plainpassword, hashpassword) => {
	const isMatch = bcrypt.compareSync(plainpassword, hashpassword)
	return isMatch;
}

export { hashPassword, comparePassword };