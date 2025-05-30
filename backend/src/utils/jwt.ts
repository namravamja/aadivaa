import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (input: string, hashed: string) => {
  return await bcrypt.compare(input, hashed);
};

export const generateToken = (payload: {
  id: string;
  role: "BUYER" | "ARTIST";
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
