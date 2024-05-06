const mongoose = require("mongoose");
const chatRoomModel = require("./model/chatroom");

const createChatRoom = async(req,res)=>{
    const {name} = req.body;
    const nameRegex = /^[A-Za-z\s]+$/;
    if(!nameRegex.test(name)){
        console.log("chatroom name contain only alphabets");
    }
    const chatRoomExist = await chatRoomModel.findOne({name});
    if(chatRoomExist){
        console.log("chatRoom already exist");
    }
    const chatRoom = new chatRoomModel({
        name,
    });
    await chatRoom.save();
    
    res.json({message:"chatRoom created"});
};

module.exports = createChatRoom;