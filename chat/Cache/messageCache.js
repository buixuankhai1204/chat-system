const redis = require("./redis");

module.exports = class messageCache {
    static async messageIdSetCache(messageFrom, messageDocument) {
        const redisKey = `messageId:${messageFrom}`;
        const cachedResult = await redis.set(redisKey, JSON.stringify(messageDocument));
        if(cachedResult) {
            return cachedResult;
        } else {
            return null;
        }
    }
}