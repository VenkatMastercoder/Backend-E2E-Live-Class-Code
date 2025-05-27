const express = require("express");

const app = express();

const Redis = require("ioredis");

const redis = new Redis(
  "rediss://default:AY8wAAIjcDE0ZTkxNjk0YWRjYjg0ZWY1YWY1ZjBkMWI3ZjU5YmE4MHAxMA@clear-tuna-36656.upstash.io:6379"
);

// 100
const rateLimiter = (maxReq, windownInSec) => {
  return async (req, res, next) => {
    const clientIp = req.ip;

    const key = `rate-limit:${clientIp}`; // 123456478

    const reqCount = await redis.incr(key); // 1

    if (reqCount === 1) {
      await redis.expire(key, windownInSec); // 1 sec
    }

    if (reqCount > maxReq) {
      const timetoExp = await redis.ttl(key);

      return res.json({
        status: false,
        message: `Rate Limit Exceesed. Try Again in ${timetoExp} Seconds`,
      });
    }

    next();
  };
};

app.use(rateLimiter(1, 10));

// API - Get localhost:3000/

app.get("/", (req, res) => {
  //1. data from frontend

  //2. DB Logic

  //3. Data to frontend
  res.send("Data from Api");
});

app.listen(3000);
