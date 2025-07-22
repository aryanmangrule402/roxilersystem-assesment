// src/utils/validationSchemas.js
import { z } from 'zod';

// Reusable password schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .max(16, "Password must be at most 16 characters long")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character");

// Reusable name schema
const nameSchema = z.string()
  .min(20, "Name must be at least 20 characters long")
  .max(60, "Name must be at most 60 characters long");

// Reusable address schema
const addressSchema = z.string()
  .max(400, "Address must be at most 400 characters long")
  .optional(); // Address is optional for registration, but for admin adding user it might be required
export const registerSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email format"),
  address: addressSchema,
  password: passwordSchema,
  // Update the role field to include 'system_admin'
  role: z.enum(["normal_user", "store_owner", "system_admin"], { // <--- ADD 'system_admin' here
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: "Please select a valid role (Normal User, Shop Owner, or System Administrator)" };
      }
      return { message: ctx.defaultError };
    },
  }).default("normal_user"),
});
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"), // Just required, not full complexity for login
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const userSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email format"),
  password: passwordSchema.optional(), // Password might be optional for admin adding user if auto-generated or updated later
  address: addressSchema,
  role: z.enum(["normal_user", "store_owner", "system_admin"]).default("normal_user"), // Role selection for admin
});

export const storeSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters").max(255, "Store name too long"),
  email: z.string().email("Invalid email format"),
  address: z.string().max(255, "Address too long"), // Assuming 255 for store address based on backend string length
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});