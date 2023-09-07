const express = require("express");
const {createServer} = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const app = express();
const httpServer = createServer(app);
const chatService = require('./chat/Services/chatService');
const messageCache = require('./chat/Cache/messageCache');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const io = new Server(httpServer, {
    cookie: true,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e9
});
dotenv.config({path: './config.env'});

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
            await messageCache.messageIdSetCache(message.content, message);
            for (let i = 0; i < msg.userIds.length; i++) {
                io.emit(msg.userIds[i], JSON.stringify(message));

            }
        }
    });

    socket.on('add member', async (msg) => {
        const channelUpdate = await chatService.addMemberToGroup(msg.channelId, msg.userId, msg.content, msg.adminId);
        if (channelUpdate.status === 'fail') {
            io.emit(msg.adminId, channelUpdate.message); // This will emit the event to all connected sockets
        } else {
            channelUpdate.content = msg.content;
            let message = `thành viên ${msg.userId} đã được thêm vào nhóm`;
            io.emit(msg.channelId, JSON.stringify(message));
        }
    });

    socket.on('leave group', async (msg) => {
        const channelUpdate = await chatService.leaveGroup(msg.channelId, msg.userId);
        if (channelUpdate.status === 'fail') {
            io.emit(msg.adminId, channelUpdate.message); // This will emit the event to all connected sockets
        } else {
            let message = `thành viên ${msg.userId} đã rời khỏi nhóm`;
            io.emit(msg.channelId, JSON.stringify(message));
        }
    });

    socket.on('add admin to group', async (msg) => {
        const channelUpdate = await chatService.addAdminstratorToUserInGroup(msg.channelId, msg.userId, msg.adminId);
        if (channelUpdate.status === 'fail') {
            io.emit(msg.adminId, channelUpdate.message); // This will emit the event to all connected sockets
        } else {
            let message = `thành viên ${msg.userId} đã được làm quản trị viên bởi ${msg.adminId}`;
            io.emit(msg.channelId, JSON.stringify(message));
        }
    });

    socket.on('upload file', async (msg) => {
        msg = {
            channelId: "",
            file: "affs,",
            userFrom: "afasf",
        }
        const channelUpdate = await chatService.uploadFile(msg.channelId, msg.file, msg.userFrom);
        if (channelUpdate.status === 'fail') {
            io.emit(msg.adminId, channelUpdate.message); // This will emit the event to all connected sockets
        } else {
            let message = `thành viên ${msg.userId} đã được làm quản trị viên bởi ${msg.adminId}`;
            io.emit(msg.channelId, JSON.stringify(message));
        }
    });

});

httpServer.listen(8080);

module.exports = httpServer;
