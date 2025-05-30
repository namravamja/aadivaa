import type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { createError } from "./errorHandler";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      throw createError(message, 400);
    }

    next();
  };
};

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
});

// Product validation schemas
export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  comparePrice: Joi.number().positive().optional(),
  sku: Joi.string().optional(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  categoryId: Joi.string().required(),
  artistId: Joi.string().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  comparePrice: Joi.number().positive().optional(),
  sku: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  categoryId: Joi.string().optional(),
  artistId: Joi.string().optional(),
});

// Category validation schemas
export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
});

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  billingAddress: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).optional(),
  paymentMethod: Joi.string().optional(),
  notes: Joi.string().optional(),
});

// Review validation schemas
export const createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().max(200).optional(),
  comment: Joi.string().max(1000).optional(),
  productId: Joi.string().required(),
});
