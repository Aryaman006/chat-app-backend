const mongoose = require("mongoose");
const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.DATABASE);
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB