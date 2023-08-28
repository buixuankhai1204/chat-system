const mongoose = require('mongoose');

const chanelSchema = new mongoose.Schema({

    userIds: {
        type: [mongoose.Schema.Types.ObjectId],
        req: [true, 'channel phải có người nhận']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

const chanelModel = mongoose.model('Channel', chanelSchema);

module.exports = chanelModel;
