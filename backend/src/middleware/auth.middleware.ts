import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import redisClient from "../services/redis.services";
import { ObjectId } from "mongodb";

configDotenv();

interface tokenUser extends JwtPayload {
  email: string;
  id: ObjectId;
}

declare global {
  namespace Express {
    interface Request {
      user: tokenUser;
    }
  }
}
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
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

    const decode = jwt.verify(token, JWT_SECRET);

    if (typeof decode === "object" && decode !== null) {
      req.user = decode as tokenUser;
    } else {
      res.status(401).send("Invalid Token");
      return;
    }

    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized user" });
  }
};
