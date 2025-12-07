import Redis from "ioredis";

import ServerConfig from "./serverConfig";

const redisConfig = {
    host: ServerConfig.REDIS_HOST,
    port: ServerConfig.REDIS_PORT
};

const redisConnection = new Redis(redisConfig);

export default redisConnection;