const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Channel',
        req: [true, 'tin nhắn phải được liên kết với người gửi']
    },
    messageFrom: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        req: [true, 'tin nhắn phải được liên kết với người nhận']
    },
    content: {
        type: String,
        req: [true, 'nội dung không được để trống'],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const messageModel = mongoose.model('Message', messageSchema);

module.exports = messageModel;
