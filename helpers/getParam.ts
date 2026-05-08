import { Request } from "express";
import errorHandler from "./errorHandler";

export const getParam = (
  req: Request,
  param: string,
  errorMessageParam: string,
) => {
  const params = req.params;
  const paramData = params[param];

  if (!paramData) throw errorHandler(400, errorMessageParam + " is not found");

  return typeof paramData !== "string" ? paramData[0] : paramData;
};
