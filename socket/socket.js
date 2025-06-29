const {Server} = require("socket.io");
const http = require("http");
const cors = require("cors");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors :{
        origin:['https://chat-app-silk-psi.vercel.app'],
        methods:['GET','POST']
    }
});

const userSocketMap = {};

const getRecieverSocketId = (recieverId)=>{
    return userSocketMap[recieverId];
};

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
    socket.on('disconnect',()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
})

module.exports = {app,io,server,getRecieverSocketId}
