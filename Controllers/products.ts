import { NextFunction, Request, Response } from "express";
import productsService from "../service/products";
import {
  cloudinaryUpload,
  controllerWrapper,
  getParam,
  isGuestMode,
} from "../helpers";

// const getProducts = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const response = await productsService.getProducts();
//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await isGuestMode(req);

    // console.log(req.query);

    // const { search } = req.query;
    const { search, lte, gte, stock, sort } = req.query;
    const response = await productsService.getProducts(
      search as string,
      lte as string,
      gte as string,
      stock as string,
      sort as string,
      data,
    );
    // const response = await productsService.getProducts(search as string, data);
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
  const id = getParam(req, "productId", "Product id");

  try {
    const product = await productsService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let photos: { link: string; id: string }[] = [];

    if (Array.isArray(req.files)) {
      photos = await cloudinaryUpload(req.files);
    }

    const newProduct = await productsService.addProducts({
      ...req.body,
      price: Number(req.body.price),
      amount: Number(req.body.amount) || 0,
      photos,
    });
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
  const id = getParam(req, "productId", "Product id");

  let newPhotos: { id: string; link: string }[] = [];

  if (Array.isArray(req.files)) {
    newPhotos = await cloudinaryUpload(req.files);
  }

  const newProduct = await productsService.updateProduct({
    productId: id,
    data: {
      ...req.body,
      price: Number(req.body.price),
      amount: Number(req.body.amount),
      newPhotos,
    },
  });

  res.status(200).json(newProduct);
};

const updateProductAmount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get product id
  const id = getParam(req, "productId", "Product id");

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
  const id = getParam(req, "productId", "Product id");

  try {
    await productsService.archiveProduct(id);

    res.sendStatus(204);
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

  const id = getParam(req, "productId", "Product id");

  try {
    await productsService.deleteProduct(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getProductStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = await productsService.getMinMaxPrice();

  res.status(200).json(result);
};

export default {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProductAmount,
  archiveProduct,
  getProductStats: controllerWrapper(getProductStats),
};
