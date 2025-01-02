import User from "../models/user.model";

export const createUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Username and password are required");
  }
  const hashedPassword = await User.hashPassword(password);

  const user = await User.create({ email, password: hashedPassword });

  return user;
};
