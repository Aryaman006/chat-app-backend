const chatroom = require("../model/chatroom.js");
const chatRoomModel = require("../model/chatroom.js");
const messageModel = require("../model/message.js");
const { getRecieverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
    try {
        const { senderId, recieverId, message } = req.body; // Corrected field name
// console.log(req.body);
        let chatRoom = await chatRoomModel.findOne({
            participants: { $all: [senderId, recieverId] }
        });

        if (!chatRoom) {
            chatRoom = await chatRoomModel.create({
                participants: [senderId, recieverId]
            });
        }

        // Create a new message
        const newMessage = await messageModel.create({
            senderId,
            recieverId, // Corrected field name
            message
        });

        // await Promise.all([chatRoom.save(),newMessage.save()])
        chatRoom.messages.push(newMessage._id);
        await chatRoom.save(); // Save the updated chat room

        const receiverSocketId = getRecieverSocketId(recieverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return res.status(200).json(newMessage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getMessage = async (req, res) => {
    try {
        const recieverId = req.params.id;
        const { senderId } = req.body;

        const chatRoom = await chatRoomModel.findOne({
            participants: { $all: [senderId, recieverId] }
        });

        if (chatRoom) {
            const messages = await messageModel.find({
                _id: { $in: chatRoom.messages } // Find messages whose IDs are in the chat room's messages array
            });

            return res.status(200).json(messages);
        } else {
            return res.status(404).json({ error: "Chat room not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { sendMessage, getMessage };
