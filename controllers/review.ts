import { Request, Response } from "express";
import { controllerWrapper, getParam, getUserData } from "../helpers";
import reviewsService from "../service/review";

const getReviews = async (req: Request, res: Response) => {
  const productId = getParam(req, "productId", "Product id");
  const reviews = await reviewsService.getReviews(productId);

  res.status(200).json(reviews);
};

const addReview = async (req: Request, res: Response) => {
  const productId = getParam(req, "productId", "Product id");

  const { id } = getUserData(req);

  await reviewsService.addReview({
    productId,
    userId: id,
    rating: Number(req.body.rating),
    comment: req.body.comment || "",
  });

  res.sendStatus(201);
};

const updateReview = async (req: Request, res: Response) => {
  const productId = getParam(req, "productId", "Product id");

  const { id: userId } = getUserData(req);

  await reviewsService.updateReview({
    productId,
    userId,
    comment: req.body.comment,
  });

  res.sendStatus(200);
};

const deleteReview = async (req: Request, res: Response) => {
  const productId = getParam(req, "productId", "Product id");

  const { id: userId } = getUserData(req);

  await reviewsService.deleteReview({ productId, userId });

  res.sendStatus(204);
};

export default {
  getReviews: controllerWrapper(getReviews),
  addReview: controllerWrapper(addReview),
  updateReview: controllerWrapper(updateReview),
  deleteReview: controllerWrapper(deleteReview),
};
