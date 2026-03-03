import { NextFunction, Request, Response } from "express";
import productsService from "../Service/products";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const response = await productsService.getProducts();
    // return response.data;
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  // get data
  // const {} = req.body;

  try {
    // await productsService.addProducts();
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
  const { productId } = req.params;

  try {
    // await productsService.addProducts();
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
  const { productId } = req.params;

  // get product data
  // const {} = req.body;
  try {
    // await productsService.addProducts();
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
  const { productId } = req.params;

  // get product data
  // const {} = req.body;
  try {
    // await productsService.addProducts();
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProductAmount,
};
