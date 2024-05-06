const mongoose = require("mongoose");
// const chatroom = require("./chatroom");

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    message:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model("message",messageSchema);