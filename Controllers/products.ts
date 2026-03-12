import { NextFunction, Request, Response } from "express";
import productsService from "../service/products";
import { errorHandler, getProductParam } from "../helpers";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await productsService.getProducts();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getProductParam(req);

  try {
    const product = await productsService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newProduct = await productsService.addProducts(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get product id
  const id = getProductParam(req);

  try {
    const newProduct = await productsService.updateProduct({
      productId: id,
      data: req.body,
    });

    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductAmount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get product id
  const id = getProductParam(req);

  if (req.body.amount < 0)
    return next(errorHandler(400, "Products amount cannot be less then 0"));

  try {
    await productsService.updateProductAmount(id, req.body.amount);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const archiveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get product id
  const id = getProductParam(req);

  try {
    await productsService.archiveProduct(id);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get product id

  const id = getProductParam(req);

  try {
    await productsService.deleteProduct(id);
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProductAmount,
  archiveProduct,
};
