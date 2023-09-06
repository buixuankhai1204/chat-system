const messageModel = require("./messageModel");
const channelModel = require("./channelModel");
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

    static async addMemberToGroup(channelId, userId) {
        let channel = await channelModel.findById(channelId);
        if(!channel) {
            return next(new AppError('không tìm thấy channel', 401));
        }

        let userIds = channel.userIds;
        let isConstrains = userIds.includes(userId);
        if(isConstrains === true) {
            return  new AppError('thành viên đã được thêm vào nhóm trứớc đó, vui lòng kiểm tra lại', 401);
        }

        userIds.push(userId);

        let channelUpdate = await channelModel.findByIdAndUpdate(channelId, {userIds: userIds});

        if(!channelUpdate) {
            return new AppError('không thể thêm thành viên mới!!', 401);
        }

        return channelUpdate;
    }

    static async leaveGroup(channelId, userId) {
        let channel = await channelModel.findById(channelId);
        if(!channel) {
            return next(new AppError('không tìm thấy channel', 401));
        }

        let userIds = channel.userIds;
        let isConstrains = userIds.includes(userId);
        if(isConstrains === false) {
            return  new AppError('user này không có trong nhóm, vui lòng kiểm tra lại', 401);
        }

        const newUserIds = userIds.filter(item => item != userId);

        let channelUpdate = await channelModel.findByIdAndUpdate(channelId, {userIds: userIds});
        if(!channelUpdate) {
            return new AppError('không thể thêm thành viên mới!!', 401);
        }

        return channelUpdate;

    }

    static async addAdminstratorToUserInGroup(channelId, userId, adminId){
        const channel = await channelModel.findById(channelId)
        if(!channel) {
            return AppError('channel không tồn tại, vui lòng kiểm tra lại', 401);
        }

        if(adminId !== channel.idRoomOwner) {
            return AppError('adminId không đúng, vui lòng kiểm tra lại', 401);
        }

        let isConstrains = userIds.includes(userId);

        if(isConstrains === false) {
            return AppError('user không tồn tại trong group, vui lòng kiểm tra lại', 401);
        }

        let isContainsAdmin = channel.adminIds.includes(userId);
        if(isConstrains === true) {
            return AppError('user này đã là admin trong group, vui lòng kiểm tra lại', 401);
        }

        let adminIds = channel.adminIds;
        adminIds.push(userId);
        const newUserIds = userIds.filter(item => item != userId);

        let updateChannel = await channelModel.findByIdAndUpdate(channelId, {userIds: newUserIds, adminIds: adminIds});
        if(!updateChannel) {
            return AppError('không thể cập nhật admin cho group, vui lòng kiểm tra lại', 401);
        }

        return updateChannel;
    }
}