const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const Chatroom = mongoose.model("Chatroom");

exports.addMessage = async (req, res) => {
	const { chatroom, message } = req.body;
	const userId = req.payload.id;

	let newMessage = new Message({
		chatroom,
		sender: userId,
		message,
	});

	await newMessage.save();
	res.json({
		message: newMessage,
	});
};

exports.getUserMessages = async (req, res) => {
	const userId = req.payload.id;

	const chatrooms = await Chatroom.find({
		participants: { $elemMatch: { particpantId: userId } },
	});
	let messages = await Promise.all(
		chatrooms.map(async (item) => {
			let lastMessage = await Message.findOne({ chatroom: item._id })
				.sort({
					createdAt: -1,
				})
				.lean()
				.exec();
			let unreadMsgCount = await Message.aggregate([
				{
					$match: {
						chatroom: item._id,
						sender: { $ne: mongoose.Types.ObjectId(userId) },
					},
				},
				{
					$group: {
						_id: "$isRead",
						count: { $sum: 1 },
					},
				},
			]);

			if (lastMessage) {
				let message = { ...lastMessage };
				if (unreadMsgCount.length > 0) {
					let count = unreadMsgCount.map((item) => item.count);
					message.unreadCount = count[0];
				} else {
					message.unreadCount = 0;
				}
				return message;
			}
		})
	);
	messages = messages.filter((el) => {
		return el != null;
	});
	res.json({
		messages,
	});
};
