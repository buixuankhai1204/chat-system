const mongoose = require('mongoose');
const appError = require('appError');

const chanelSchema = new mongoose.Schema({

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
chanelSchema.pre('updateOne', function(next) {
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


const chanelModel = mongoose.model('Channel', chanelSchema);

module.exports = chanelModel;
