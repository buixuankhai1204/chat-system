const messageModel = require("./messageModel");
const AppError = require("./appError");
const mongoose = require('mongoose');

module.exports = class chatService {
    static async createMessageChat(channelId, userFrom, content) {
        let data = {};
        console.log(channelId)
        data.channelId = mongoose.Types.ObjectId(channelId);
        data.messageFrom = mongoose.Types.ObjectId(userFrom);
        data.content = content;
        const message = await messageModel.create(data);
        if (!message) {
            return new AppError('không chưa thể gửi tin nhắn mới', 401);
        }
        return message;
    }
}