import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = async function (
  password: string
): Promise<string> {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function (): Promise<string> {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET as string);
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
