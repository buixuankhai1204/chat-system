const redis = require("./redis");
const channels = require("../Model/channelModel");
const mongoose = require("mongoose");

module.exports = class messageCache {
    static async messageIdCacheData(req, res, next) {
        const redisKey = `messageId:${req.body.content}`;
        const cachedResult = await redis.get(redisKey);
        if (!cachedResult) {
            return null;
        } else {
            return JSON.parse(cachedResult);
        }
    }

    static async messageIdSetCache(messageFrom, messageDocument) {
        const redisKey = `messageId:${messageFrom}`;
        const cachedResult = await redis.set(redisKey, JSON.stringify(messageDocument));
        if (cachedResult) {
            return cachedResult;
        } else {
            return null;
        }
    }

    static async cacheMessageToListMessageByMessageId(channelId, messageId, document) {
        let rediskey = `channelId:${channelId}`;
        let messageInsert = `messageFrom:document:${messageId}:${JSON.stringify(document)}`
        await redis.LPUSH(rediskey, messageInsert);
        let len = await redis.LLEN(rediskey);
        if (len > 100) {
            await redis.RPOP(rediskey);
        }
    }

    static async getListMessagesCacheByChannelId(channelId) {
        let listMessageResult = [];
        let rediskey = `channelId:${channelId}`;
        let listMessages = await redis.LRANGE(rediskey, 0, -1);
        if (!listMessages) {
            return null;
        }
        for (let i = 0; i < listMessages.length; i++) {
            const messagePartIndex = listMessages[i].search('{');
            const messagePart = listMessages[i].slice(messagePartIndex);
            console.log(`messagePart: ${messagePart}`);

            let messageObj = JSON.parse(messagePart);
            listMessageResult.push(messageObj);
        }

        return listMessageResult;
    }

    static async cacheChannelToListChannelsByUserId(userId, channelId, channel) {
        let rediskey = `userId:listChannel:${userId}`;
        let channelInsert = `channelId:channel:${channelId}:${JSON.stringify(channel)}`
        await redis.LPUSH(rediskey, channelInsert);
        let len = await redis.LLEN(rediskey);
        if (len > 100) {
            await redis.RPOP(rediskey);
        }
    }


    static async getlistChannelCache(userId) {
        let listChannelResult = [];
        let rediskey = `userId:listChannel:${userId}`;
        let listChannels = await redis.LRANGE(rediskey, 0, -1);
        if (!listChannels) {
            return null;
        }

        for (let i = 0; i < listChannels.length; i++) {
            const messagePartIndex = listChannels[i].search('{');
            const messagePart = listChannels[i].slice(messagePartIndex);
            console.log(`channelPart: ${messagePart}`);

            let messageObj = JSON.parse(messagePart);
            listChannelResult.push(messageObj);
        }

        return listChannelResult;
    }

    static async warmUpListChannelById(userId) {
        let rediskey = `userId:listChannel:${userId}`;
        let channels = await channelModel.aggregate([{$match: {userIds: mongoose.Types.ObjectId(userId)}},
        ]).limit(100);
        await redis.DEL(rediskey);
        for (let i = 0; i < channels.length; i++) {
            await this.cacheChannelToListChannelsByUserId(userId,channels[i].id,channels[i]);
        }

        return channels;
    }
}
