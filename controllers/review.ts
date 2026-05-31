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

  await reviewsService.addReview({
    productId,
    email: req.body.email,
    name: req.body.name,
    rating: Number(req.body.rating),
    comment: req.body.comment || "",
  });

  res.sendStatus(201);
};

const updateReview = async (req: Request, res: Response) => {
  const reviewId = getParam(req, "reviewId", "Review id");

  const { id: userId } = getUserData(req);

  await reviewsService.updateReview({
    reviewId,
    userId,
    comment: req.body.comment,
    rating: req.body.rating,
  });

  res.sendStatus(200);
};

const deleteReview = async (req: Request, res: Response) => {
  const reviewId = getParam(req, "reviewId", "Review id");

  const { id: userId } = getUserData(req);

  const data = await reviewsService.deleteReview({ reviewId, userId });

  res.status(200).json(data);
};

export default {
  getReviews: controllerWrapper(getReviews),
  addReview: controllerWrapper(addReview),
  updateReview: controllerWrapper(updateReview),
  deleteReview: controllerWrapper(deleteReview),
};
