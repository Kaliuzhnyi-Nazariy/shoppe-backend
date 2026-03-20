import { NextFunction, Request, Response } from "express";
import { errorHandler, getUserData } from "../helpers";
import service from "../service/cart";
import { controllerWrapper } from "../helpers/";

const getItemParam = (
  req: Request,
  res: Response,
  next: NextFunction,
): string => {
  const { itemId } = req.params;

  if (!itemId) throw errorHandler(400, "Item id is required");

  return typeof itemId !== "string" ? itemId[0] : itemId;
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  try {
    const response = await service.getCart(id);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  await service.addToCart({ userId: id, product: req.body });
  res.sendStatus(204);
  // try {
  // await service.addToCart({ userId: id, product: req.body });
  // res.sendStatus(204);
  // } catch (error) {
  //   next(error);
  // }
};

const reduceQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   try {
  //   } catch (error) {
  //     next(error);
  //   }
  const { id } = getUserData(req);

  const productId = getItemParam(req, res, next);

  await service.removeFromCart({
    userId: id,
    productId,
    quantity: req.body.quantity,
  });

  res.sendStatus(204);
};

const removeItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const productId = getItemParam(req, res, next);

  await service.removeItemFromCart({
    userId: id,
    productId,
  });
  res.sendStatus(204);
};

const cleanCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  await service.cleanCart(id);
  res.sendStatus(204);
};
// export default { getCart, addToCart, reduceQuantity };

export default {
  getCart: controllerWrapper(getCart),
  addToCart: controllerWrapper(addToCart),
  reduceQuantity: controllerWrapper(reduceQuantity),
  removeItemFromCart: controllerWrapper(removeItemFromCart),
  cleanCart: controllerWrapper(cleanCart),
};
