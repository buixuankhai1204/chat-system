const messageModel = require("../Model/messageModel");
const channelModel = require("../Model/channelModel");
const AppError = require("../Utilities/appError");
const messageCache = require("../Cache/messageCache");
const mongoose = require('mongoose');

module.exports = class chatService {
    static async createMessageChat(channelId, userFrom, content) {
        let data = {};
        data.channelId = mongoose.Types.ObjectId(channelId);
        data.messageFrom = mongoose.Types.ObjectId(userFrom);
        data.content = content;
        const message = await messageModel.create(data);
        if (!message) {
            return new AppError('không chưa thể gửi tin nhắn mới', 401);
        }
        return message;
    }

    static async addMemberToGroup(channelId, userId, adminId) {
        let channel = await channelModel.findById(channelId);
        if(!channel) {
            return next(new AppError('không tìm thấy channel', 401));
        }

        if(channel.isAdmin(adminId) === false) {
            return  new AppError('chưa có quyền quản trị viên, vui lòng kiểm tra lại', 401);
        }

        if(channel.isUser(userId) === true) {
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


        if(channel.isUser(userId) === false) {
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

        if(channel.isUser(userId) === false) {
            return AppError('user không tồn tại trong group, vui lòng kiểm tra lại', 401);
        }

        if(channel.isAdmin(userId) === true) {
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

    static async changeNameGroup(channelId, name, adminId) {
        const channel = await channelModel.findById(channelId)
        if(!channel) {
            return AppError('channel không tồn tại, vui lòng kiểm tra lại', 401);
        }

        if(channel.isAdmin(adminId) === false) {
            return AppError('user này đã là admin trong group, vui lòng kiểm tra lại', 401);
        }

        if(channel.name === name) {
            return AppError('tên group trùng với tên cũ, vui lòng kiểm tra lại', 401);
        }

        const channelUpdateName = await channel.findByIdAndUpdate(channelId, {name: name});
        if(!channelUpdateName) {
            return AppError('không thể cập nhật tên cho group, vui lòng kiểm tra lại', 401);
        }

        return channelUpdateName;

    }

    static async saveFile(channelId, usserId, file) {
        console.log(file);
        name = `${channelId}-${userId}-${file.name}`;
        writeFile(`/file/${name}.img`, file, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }

    static async getlistChannelsByCache(userId) {
        let listChannels = await messageCache.getlistChannelCache(userId);

        if(listChannels == null) {
            listChannels = await messageCache.warmUpListChannelById(userId);
        }
        return listChannels;
    }
}