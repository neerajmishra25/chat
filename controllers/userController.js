const mongoose = require("mongoose");
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
	const { name, email, password } = req.body;

	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!emailRegex.test(String(email).toLowerCase()))
		throw "Email is not valid.";
	if (!password || password.length < 6)
		throw "Password must be atleast 6 characters long.";

	const userExists = await User.findOne({
		email,
	});

	if (userExists) throw "User with same email already exits.";

	const user = new User({
		name,
		email,
		password: sha256(password + process.env.SALT),
	});

	await user.save();

	res.json({
		message: "User [" + name + "] registered successfully!",
	});
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({
		email,
		password: sha256(password + process.env.SALT),
	});

	if (!user) throw "Email and Password did not match.";

	const token = await jwt.sign({ id: user.id }, process.env.SECRET);

	res.json({
		message: "User logged in successfully!",
		token,
	});
};
