const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const chatService = require('./chat/chatService');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const io = new Server(httpServer, {
    cookie: true,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
dotenv.config({ path: './config.env' });

mongoose
    .connect("mongodb://mongodb:latest:27017/BackendProject", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB connection successful!')
    });

app.use(cors());
io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
        const message = await chatService.createMessageChat(msg.channelId, msg.userFrom, msg.content);
        if (!message) {
            io.emit(msg.userFrom, "send error"); // This will emit the event to all connected sockets
        } else {
            message.content = msg.content;
            console.log(`userId: ${msg.userId}` );

            io.emit(msg.userId, JSON.stringify(message));
            // This will emit the event to all connected sockets
        }
    });
});

httpServer.listen(8080);

module.exports = httpServer;
