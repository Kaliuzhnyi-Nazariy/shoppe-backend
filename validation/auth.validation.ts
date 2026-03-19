import { z } from "zod";

export const userSignupValidation = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name should be at least 3 characters" }),

    lastName: z
      .string()
      .min(3, { message: "Last name should be at least 3 characters" }),

    displayName: z
      .string()
      .min(3, { message: "Display name should be at least 3 characters" }),

    email: z.string().email({ message: "Enter a valid email address" }),

    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain at least 8 characters, including a letter and a number",
      ),

    confirmPassword: z.string(),
    role: z.enum(["admin", "customer"]).optional().default("customer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInValidation = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least 8 characters, including a letter and a number",
    ),
});

export const forgetPasswordEmailValidation = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const resetPasswordValidation = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Password must contain at least 8 characters, including a letter and a number",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
