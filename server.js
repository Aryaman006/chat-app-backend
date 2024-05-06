const express = require("express");
// const app = express();
const {app,server} = require('./socket/socket')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const messageRoute = require("./routes/messageRoute");
const authRoute = require("./routes/authRoute");
const bodyParser = require('body-parser');
const cors = require("cors");
app.use(bodyParser.json());
app.use(express.json());

dotenv.config();
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
    }
};

app.use(express.urlencoded({ extended: true }));
connectDB();

const corsOption = {
        origin:"http://localhost:5173",
        methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
        credentials:true
}
app.use(cors(corsOption));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/message", messageRoute);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
});
