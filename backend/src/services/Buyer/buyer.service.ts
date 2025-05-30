import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/jwt";

const prisma = new PrismaClient();

export interface BuyerUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export const createBuyer = async (data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
}) => {
  const existing = await prisma.buyer.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(data.password);

  const buyer = await prisma.buyer.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  return buyer;
};

export const getBuyerById = async (id: string) => {
  const buyer = await prisma.buyer.findUnique({
    where: { id },
    select: {
      password: false,
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      dateOfBirth: true,
      gender: true,
      createdAt: true,
      addresses: true,
    },
  });
  if (!buyer) throw new Error("Buyer not found");
  return buyer;
};

export const updateBuyer = async (id: string, data: BuyerUpdateData) => {
  const buyer = await prisma.buyer.update({
    where: { id },
    data,
    select: {
      password: false,
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      dateOfBirth: true,
      gender: true,
      createdAt: true,
    },
  });
  return buyer;
};

export const deleteBuyer = async (id: string) => {
  await prisma.buyer.delete({ where: { id } });
  return { message: "Buyer deleted" };
};

export const listBuyers = async () => {
  return prisma.buyer.findMany({
    select: {
      password: false,
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      dateOfBirth: true,
      gender: true,
      createdAt: true,
    },
  });
};
