import { z } from "zod";

// enum ShippingOptions {
//   free,
//   paid,
// }

// enum OrderStatus {
//   pending,
//   paid,
//   shipping,
//   delivered,
//   canceled,
// }

// enum PaymentMethods {
//   cashOnDelivery,
//   stripe,
//   checkPayment,
// }

export const orderValidation = z.object({
  billingAddress: z.object({
    firstName: z
      .string()
      .min(3, "First name should be longer than 3 characters"),
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
  }),

  shippingAddress: z.object({
    firstName: z
      .string()
      .min(3, "First name should be longer than 3 characters"),
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
  }),

  buyerEmail: z.email(),
  contactNumber: z.string().regex(/^\+[1-9]\d{7,14}$/),

  deliveryOption: z.enum(["free", "paid"]).default("free"),
  status: z
    .enum(["pending", "paid", "shipping", "delivered", "canceled"])
    .default("pending"),

  paymentMethod: z.enum(["stripe", "cashOnDelivery", "checkPayment"]),
  payment: z.any(),

  totalPrice: z.number().gte(0),
  notes: z.string().optional(),

  items: z.array(
    z.object({
      productId: z.string(),
      productTitle: z.string(),
      quantity: z.number(),
      price: z.number(),
    }),
  ),
});
