import { createUser } from "../services/user.services";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import User from "../models/user.model";
import redisClient from "../services/redis.services";

redisClient;

export const createUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created successfuly" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error });
  }
};

export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const isValid = await user.isValidPassword(password);

    if (!isValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successfuly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
};

export const profileController = async (req: Request, res: Response) => {
  console.log(req.user);
  res.json({ user: req.user });
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error });
  }
};
