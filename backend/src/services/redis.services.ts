import Redis from "ioredis";
import { configDotenv } from "dotenv";
configDotenv();

const redisClient = new Redis({
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string, 10),
  password: process.env.REDIS_PASSWORD as string,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

export default redisClient;
