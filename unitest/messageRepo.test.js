const request = require("supertest");
const app = require("../app");
const {connect, disconnect} = require("../mongooseConfig");
const dotenv = require("dotenv");
const messageModel = require("../model/messageModel");
const channelModel = require("../model/channelModel");
const userModel = require("../model/userModel");
const mongoose = require("mongoose");
const chatService = require("../service/");

describe('Test All test cases repository of message', () => {
    beforeAll(async () => {
        connect();
    });

    describe('GetAllMessageByChannelId', () => {
        it('shouldReturnAllMessageByChannelId', async () => {
            const channelId = "64df465c4fd5916745afd02f";
            let messages = await messageModel.aggregate([{$match: {channelId: mongoose.Types.ObjectId(channelId)}}]);
            expect(messages).not.toHaveLength(0);
        })

        it('shouldNotReturnAllMessageIfChannelIdDoesNotExist', async () => {
            const channelId = "64df465c4fd5916745afd03f";
            let messages = await messageModel.aggregate([{$match: {channelId: mongoose.Types.ObjectId(channelId)}}]);
            expect(messages).toHaveLength(0);
        })
    })

    describe('CreateMessage', () => {
        it('shouldReturnCreateMessage', async () => {
            let msg = {
                channelId: "64df465c4fd5916745afd02f",
                userFrom: "64df465c4fd5916745afd02f",
                content: "xuankhai!!!"
            }
            let data = {};
            data.channelId = mongoose.Types.ObjectId(msg.channelId);
            data.messageFrom = mongoose.Types.ObjectId(msg.userFrom);
            data.content = msg.content;
            const message = await messageModel.create(data);
            expect(message).toHaveProperty('_id');
        })

        it('shouldNotReturnCreateMessageIfChannelIdDoesNotExist', async () => {
            var channelId = "64df465c4fd5916745bfd02f";
            const channel = await channelModel.findById(channelId);
            expect(channel).toBe(null);

        })

        it('shouldNotReturnCreateMessageIfUserIdDoesNotExist', async () => {
            var userId = "64df465c4fd5916745bfd02f";
            const user = await userModel.findById(userId);
            expect(user).toBe(null);
        })
    })
    afterAll((done) => {
        disconnect(done);
    });
});

