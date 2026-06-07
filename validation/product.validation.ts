import { z } from "zod";

const CATEGORY_OPTIONS = [
  "ELECTRONICS",
  "GAMING",
  "HOME",
  "OTHER",
  "JEWELRY",
  "BOOKS",
  "FOOD",
] as const;

export const addAndUpdateProductValidation = z.object({
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),

  price: z.string(),
  amount: z.string().optional(),
  // categories: z.array(z.string()).or(z.string()).optional(),
  categories: z
    .array(z.enum(CATEGORY_OPTIONS))
    .min(1)
    .or(z.enum(CATEGORY_OPTIONS)),
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
  categories: z
    .array(z.enum(CATEGORY_OPTIONS))
    .min(1)
    .or(z.enum(CATEGORY_OPTIONS)),
});
