import z from "zod";

// export const addReviewValidation = z.object({
//   rating: z.number().min(1).max(5),
//   comment: z.string().trim().min(1).max(256),
// });

export const updateReviewValidation = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(1).max(256),
});

export const addReviewValidation = z.object({
  email: z.email(),
  name: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().max(256),
});
