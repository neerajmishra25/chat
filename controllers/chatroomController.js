const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

exports.createChatroom = async (req, res) => {
	const { name, roomType, participants } = req.body;
	const userId = req.payload.id;
	// console.log(participants[0]);
	// check if already contacts
	if (roomType == "contact") {
		const contact = await Chatroom.find({
			$and: [
				{ roomType: roomType },
				{ participants: { $elemMatch: { particpantId: userId } } },
				{ participants: { $elemMatch: { particpantId: participants[0] } } },
			],
		});
		if (contact.length > 0) {
			console.log(contact);
			return res.status(409).json({ contact });
		}
	}

	const chatroom = new Chatroom({
		name,
		roomType,
	});

	participants.forEach((currentItem, index) => {
		chatroom["participants"].push({ particpantId: currentItem });
	});
	chatroom["participants"].push({ particpantId: userId });

	await chatroom.save();

	res.json({
		message: "Chatroom created!",
	});
};

exports.getAllChatrooms = async (req, res) => {
	const chatrooms = await Chatroom.find({});

	res.json(chatrooms);
};
