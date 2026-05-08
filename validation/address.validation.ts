import { z } from "zod";

export const addressValidation = z.object({
  firstName: z.string().min(3, "First name should be longer than 3 characters"),
  lastName: z.string().min(3, "Last name should be longer than 3 characters"),
  companyName: z.string().optional().default(""),
  country: z.string(),
  streetAddress: z.string(),
  postcode: z
    .string()
    .regex(
      /^(\d{5}(?:-\d{4})?|[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}|[A-Z]{2}[0-9]{5}|[0-9]{5}|[0-9]{4})$/,
    ),
  city: z.string(),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  email: z.email(),
});
