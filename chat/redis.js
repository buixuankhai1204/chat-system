const redis = require("redis");

let redisClient;
(async () => {
    redisClient = redis.createClient({
        url: 'redis://redis:6379'
    });
    redisClient.on("error", (error) => console.log(`Error: ${error}`));
    redisClient = await redisClient.connect();
    return redisClient;
})();
module.exports = redisClient;