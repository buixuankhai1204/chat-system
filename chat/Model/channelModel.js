const mongoose = require('mongoose');
const appError = require('chat/Utilities/appError');

const channelSchema = new mongoose.Schema({

    nameChannel: {
        type: String,
    },
    idRoomOwner: {
        type: [mongoose.Schema.Types.ObjectId],
        req: [true, 'channel phải có người nhận']
    },
    type: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0,
        select: false
    },
    adminIds: {
        type: [mongoose.Schema.Types.ObjectId],
        req: [true, 'channel phải có người nhận'],
    },

    userIds: {
        type: [mongoose.Schema.Types.ObjectId],
        req: [true, 'channel phải có người nhận']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});
channelSchema.pre('updateOne', function(next) {
    for (let i = 0; i < this.userIds.length; i++) {
        for (let j = 0; j < this.adminIds.length; j++) {
            if(this.userIds[i] === this.adminIds[j]) {
                return next(new appError('2 danh sách đang bị trùng lặp, vui lòng kiểm tra lại', 401));
            }
        }
    }
    next();
});

channelSchema.pre('save', function (next) {

})

channelSchema.methods.isAdmin = async function(
    adminId
) {
    let isContain = this.adminIds.includes(adminId);
    if(isContain === true) {
        return true;
    }

    return false;
};

channelSchema.methods.isUser = async function(
    userId
) {
    let isContain = this.userIds.includes(userId);
    if(isContain === true) {
        return true;
    }
    return false;
};


const chanelModel = mongoose.model('Channel', channelSchema);

module.exports = chanelModel;
