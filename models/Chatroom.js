const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: "Name is required!",
		default: "Contact Group",
	},
	roomType: {
		type: String,
		enum: ["contact", "group"],
		default: "single",
	},
	participants: [
		{
			particpantId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
