import { z } from "zod";

export const addAndUpdateProductValidation = z.object({
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),

  price: z.string(),
  amount: z.string().optional(),
});

export const updateAmpuntOfProduct = z.object({
  amount: z.number().min(0, "Products amount cannot be less then 0"),
});

export const UpdateProductValidation = z.object({
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),

  price: z.string(),
  amount: z.string(),
  photos: z.array(z.string()).or(z.string()).optional(),
});
