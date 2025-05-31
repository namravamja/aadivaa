import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, generateToken } from "../../utils/jwt";

interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const prisma = new PrismaClient();

export const signupBuyer = async (data: SignupData) => {
  const existing = await prisma.buyer.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already registered");

  const hashed = await hashPassword(data.password);

  const buyer = await prisma.buyer.create({
    data: { ...data, password: hashed },
  });

  return { message: "Buyer created", id: buyer.id };
};

export const loginBuyer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const buyer = await prisma.buyer.findUnique({ where: { email } });
  if (!buyer || !(await comparePassword(password, buyer.password))) {
    throw new Error("Invalid credentials");
  }
  const token = generateToken({ id: buyer.id, role: "BUYER" });

  await prisma.buyer.update({
    where: { id: buyer.id },
    data: { isAuthenticated: true },
  });

  return { token, buyer };
};

export const signupArtist = async (data: SignupData) => {
  const existing = await prisma.artist.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already registered");

  const hashed = await hashPassword(data.password);

  const artist = await prisma.artist.create({
    data: { ...data, password: hashed },
  });

  return { message: "Artist created", id: artist.id };
};

export const loginArtist = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const artist = await prisma.artist.findUnique({ where: { email } });
  if (!artist || !(await comparePassword(password, artist.password))) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: artist.id, role: "ARTIST" });

  await prisma.artist.update({
    where: { id: artist.id },
    data: { isAuthenticated: true },
  });

  return { token, artist };
};
