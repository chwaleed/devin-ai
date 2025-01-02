import { createUser } from "../services/user.services";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import User from "../models/user.model";

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

    res.status(201).json({ user, token });
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

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
};
