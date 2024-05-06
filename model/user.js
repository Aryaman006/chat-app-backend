const mongoose = require("mongoose");
const { type } = require("os");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures uniqueness of email addresses
    },
    password: {
        type: String,
        required: true
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:true
    },
    profilePhoto:{
        type:String,
        default:"", 
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the current date and time
    }
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
