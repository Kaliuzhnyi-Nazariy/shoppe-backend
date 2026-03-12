import { z } from "zod";

export const addAndUpdateProductValidation = z.object({
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),
  price: z.number(),
  amount: z.number(),
  photos: z.array(z.string()).optional(),
});

export const updateAmpuntOfProduct = z.object({
  amount: z.number(),
});
