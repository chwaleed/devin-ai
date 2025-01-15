import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import redisClient from "../services/redis.services";

configDotenv();

declare global {
  namespace Express {
    interface Request {
      user: any | JwtPayload; // Add the user property to the Request interface
    }
  }
}
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    const isLogout = await redisClient.get(token);

    if (isLogout) {
      res.cookie("token", "");
      res.status(401).send({ error: "Unauthorized user" });
      return;
    }

    if (!token) {
      res.status(401).send({ error: "Unauthorized user" });
      return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized user" });
  }
};
