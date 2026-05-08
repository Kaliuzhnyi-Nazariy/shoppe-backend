import { z } from "zod";

// const photoSchema = z.instanceof(File);

// const photoSchema = z.custom<File>((file) => {
//   return (
//     file &&
//     typeof file === "object" &&
//     "name" in file &&
//     "size" in file &&
//     "type" in file
//   );
// }, "Invalid file");

export const addAndUpdateProductValidation = z.object({
  // product_photo: z.array(z.object()),
  // product_photo: z.array(photoSchema),
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),
  // price: z.number(),
  // amount: z.number().optional(),

  price: z.string(),
  amount: z.string().optional(),
  // photos: z.array(z.string()).optional(),
});

export const updateAmpuntOfProduct = z.object({
  amount: z.number().min(0, "Products amount cannot be less then 0"),
});

const photoSchema = z.object({
  id: z.string(),
  link: z.string(),
});

export const UpdateProductValidation = z.object({
  // product_photo: z.array(z.object()),
  // product_photo: z.array(photoSchema),
  title: z.string().trim().min(3, "Title should be at least 3 characters long"),
  description: z
    .string()
    .trim()
    .min(20, "Description should be at least 20 characters long"),
  additionalInformation: z.string().optional(),
  // price: z.number(),
  // amount: z.number().optional(),

  price: z.string(),
  amount: z.string().optional(),
  // photos: z.array(photoSchema).optional(),
  photos: z.array(z.string()).or(z.string()).optional(),
});
