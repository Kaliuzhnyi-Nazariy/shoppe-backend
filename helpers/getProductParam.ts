import { Request } from "express";
import { errorHandler } from "../helpers";

export const getProductParam = (req: Request) => {
  const { productId } = req.params;

  if (!productId) throw errorHandler(400, "Product id is required");

  return typeof productId !== "string" ? productId[0] : productId;
};
