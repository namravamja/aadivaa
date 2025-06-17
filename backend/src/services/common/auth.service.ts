import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateVerificationToken,
} from "../../utils/jwt";
import { sendVerificationEmail } from "../../helpers/mailer";

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

  const hashed: string = await hashPassword(data.password);

  const buyer = await prisma.buyer.create({
    data: { ...data, password: hashed },
  });

  const verifyToken = generateVerificationToken({
    id: buyer.id,
    role: "BUYER",
  });

  // Save token & expiry (1 day expiry)
  await prisma.buyer.update({
    where: { id: buyer.id },
    data: {
      verifyToken,
      verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // Send verification email
  await sendVerificationEmail(buyer.email, verifyToken);

  setTimeout(async () => {
    const freshBuyer = await prisma.buyer.findUnique({
      where: { id: buyer.id },
    });
    if (freshBuyer && !freshBuyer.isVerified) {
      await prisma.buyer.delete({ where: { id: buyer.id } });
    }
  }, 7 * 60 * 1000); // 7 minutes delay

  return {
    message: "Buyer created, Please check your email to verify your account.",
    id: buyer.id,
  };
};

export const loginBuyer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const buyer = await prisma.buyer.findUnique({ where: { email } });
  if (
    !buyer ||
    !buyer.password ||
    !(await comparePassword(password, buyer.password))
  ) {
    throw new Error("Invalid credentials");
  }
  if (!buyer.isVerified) {
    throw new Error("Please verify your email before logging in");
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

  const verifyToken = generateVerificationToken({
    id: artist.id,
    role: "ARTIST",
  });

  await prisma.artist.update({
    where: { id: artist.id },
    data: {
      verifyToken,
      verifyExpires: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  await sendVerificationEmail(artist.email, verifyToken);

  setTimeout(async () => {
    const freshArtist = await prisma.artist.findUnique({
      where: { id: artist.id },
    });
    if (freshArtist && !freshArtist.isVerified) {
      await prisma.artist.delete({ where: { id: artist.id } });
      console.log(
        `Deleted unverified artist with id ${artist.id} after 5 minutes`
      );
    }
  }, 7 * 60 * 1000);

  return {
    message: "Artist created, Please check your email to verify your account.",
    id: artist.id,
  };
};

export const loginArtist = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const artist = await prisma.artist.findUnique({ where: { email } });
  if (
    !artist ||
    !artist.password ||
    !(await comparePassword(password, artist.password))
  ) {
    throw new Error("Invalid credentials");
  }
  if (!artist.isVerified) {
    throw new Error("Please verify your email before logging in");
  }
  const token = generateToken({ id: artist.id, role: "ARTIST" });

  await prisma.artist.update({
    where: { id: artist.id },
    data: { isAuthenticated: true },
  });

  return { token, artist };
};
