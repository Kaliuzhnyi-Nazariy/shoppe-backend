import { z } from "zod";

export const cartAddValidation = z.object({
  productId: z.string(),
  quantity: z.number().gt(0, "Value should be grater than 0"),
});

export const cartRemoveValidation = z.object({
  quantity: z.number().gt(0, "Value should be grater than 0"),
});
